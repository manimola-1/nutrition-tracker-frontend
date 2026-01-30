import React, { useState, useEffect, useCallback, useRef } from "react";
import { patientsAPI, patientDaysAPI } from "../../services/api";
import { exportToPDF, exportToCSV } from "../../utils/exportUtils";
import { nutritionProducts } from "../../data/nutritionProducts";
import {
  formatNum,
  safeParseFloat,
  calculateIBW,
  calculateBMI,
  calculateABW,
  calculateFullGoalKcal,
  calculateRampPercent,
  calculateGoalProtein,
  calculateAutoSpeed,
  getStatusClass,
  getKcalStatusClass,
} from "../../utils/calculations";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import LanguageToggle from "../LanguageToggle/LanguageToggle";
import PatientForm from "../PatientForm/PatientForm";
import DailyGoals from "../DailyGoals/DailyGoals";
import PreparationsTable from "../PreparationsTable/PreparationsTable";
import GoalFulfillment from "../GoalFulfillment/GoalFulfillment";
import PerKgCalculations from "../PerKgCalculations/PerKgCalculations";
import RampGraph from "../RampGraph/RampGraph";
import PatientHistory from "../PatientHistory/PatientHistory";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SuccessMessage from "../SuccessMessage/SuccessMessage";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function NutritionTracker() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  // eslint-disable-next-line no-unused-vars
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled",
  );
  const [patientData, setPatientData] = useState({
    patient_id: "",
    height: "",
    weight: "",
    gender: "M",
    day: 1,
    calorimeter: "NIE",
    ree: "",
    protein_goal_min: 1.5,
    protein_goal_max: 1.5,
    fluid_limit: "",
    selected_protein_preset: "",
  });
  const [preparations, setPreparations] = useState([]);
  const preparationsRef = useRef(preparations);
  const isUpdatingRef = useRef(false);
  const confirmResolveRef = useRef(null);
  const [calculations, setCalculations] = useState({});
  const [isFluidLimitManual, setIsFluidLimitManual] = useState(false);
  const [patientsList, setPatientsList] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPatient, setCurrentPatient] = useState(null); // Store current patient ID
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await logout();
  };

  // Update ref when preparations change
  useEffect(() => {
    preparationsRef.current = preparations;
  }, [preparations]);

  /**
   * Core calculation: patient body metrics, daily goals (kcal + protein), prep totals,
   * auto speed for marked row, and goal fulfillment (diffs + status classes).
   */
  const updateCalculations = useCallback(() => {
    // --- 1. Patient inputs (with fallbacks) ---
    const height = safeParseFloat(patientData.height, 0);
    const weight = safeParseFloat(patientData.weight, 0);
    const gender = patientData.gender;
    const day = parseInt(patientData.day, 10) || 1;
    const hasCal = patientData.calorimeter === "ÁNO";
    const ree = hasCal ? safeParseFloat(patientData.ree, 0) : 0;
    let proteinMinKg = safeParseFloat(patientData.protein_goal_min, 1.5);
    let proteinMaxKg = safeParseFloat(patientData.protein_goal_max, 1.5);

    // Ensure min ≤ max; auto-swap and sync state if user typed max < min
    if (proteinMinKg > proteinMaxKg) {
      const temp = proteinMinKg;
      proteinMinKg = proteinMaxKg;
      proteinMaxKg = temp;
      // Only update if values actually changed
      if (
        safeParseFloat(patientData.protein_goal_min, 1.5) !== proteinMinKg ||
        safeParseFloat(patientData.protein_goal_max, 1.5) !== proteinMaxKg
      ) {
        setPatientData((prev) => ({
          ...prev,
          protein_goal_min: proteinMinKg,
          protein_goal_max: proteinMaxKg,
        }));
      }
    }

    // --- 2. Body weight metrics (IBW, BMI, ABW) ---
    const ibw = calculateIBW(height, gender);
    const bmi = calculateBMI(height, weight);
    const abw = calculateABW(weight, ibw);

    // Auto fluid limit = ceil(ABW × 25 / 100) × 100 ml, only when not manually set
    if (abw > 0 && !isFluidLimitManual) {
      const calculatedLimit = Math.ceil((abw * 25) / 100) * 100;
      const currentLimit = safeParseFloat(patientData.fluid_limit, 0);
      // Only update if the calculated value is different from current
      if (currentLimit !== calculatedLimit) {
        setPatientData((prev) => ({
          ...prev,
          fluid_limit: calculatedLimit.toString(),
        }));
      }
    }

    // --- 3. Daily goals ---
    const fullGoalKcal = calculateFullGoalKcal(abw, hasCal, ree);
    const rampPercent = calculateRampPercent(day, hasCal);
    const recGoalKcal = fullGoalKcal * (rampPercent / 100);
    // Protein goal in grams: min = proteinMinKg × ABW, max = proteinMaxKg × ABW
    const goalProtein = calculateGoalProtein(proteinMinKg, proteinMaxKg, abw);

    const currentPreparations = preparationsRef.current;

    // --- 4. Find which row is “auto” (kcal or protein) ---
    let autoType = null;
    let autoRowIndex = null;
    currentPreparations.forEach((prep, index) => {
      if (prep.autoKcal) {
        autoType = "kcal";
        autoRowIndex = index;
      } else if (prep.autoProtein) {
        autoType = "protein";
        autoRowIndex = index;
      }
    });

    // --- 5. Fixed totals from non-auto rows (for auto speed calculation) ---
    let fixedKcal = 0;
    let fixedProtein = 0;
    const updatedPreparations = currentPreparations.map((prep, index) => {
      if (index === autoRowIndex) {
        return prep; // Will update auto row separately
      }
      const product = nutritionProducts.find((p) => p.name === prep.name);
      if (product) {
        const speed = safeParseFloat(prep.speed, 0);
        const hours = safeParseFloat(prep.hours, 24);
        const ml = speed * hours;
        const kcalRow = ml * product.kcal;
        const proteinRow = ml * product.bielk;
        fixedKcal += kcalRow;
        fixedProtein += proteinRow;
        return {
          ...prep,
          calculations: {
            ml: formatNum(ml, 1),
            kcal: formatNum(kcalRow, 1),
            protein: formatNum(proteinRow, 1),
            fat: formatNum(ml * product.tuk, 1),
            carb: formatNum(ml * product.cukry, 1),
          },
        };
      }
      return {
        ...prep,
        calculations: { ml: "0", kcal: "0", protein: "0", fat: "0", carb: "0" },
      };
    });

    // --- 6. Auto speed: fill remaining kcal or protein with the marked row ---
    if (autoRowIndex !== null && autoRowIndex < updatedPreparations.length) {
      const autoPrep = updatedPreparations[autoRowIndex];
      const product = nutritionProducts.find((p) => p.name === autoPrep.name);
      if (product) {
        const hours = safeParseFloat(autoPrep.hours, 24);
        let remaining = 0;
        let perMl = 0;
        if (autoType === "kcal" && product.kcal > 0) {
          remaining = recGoalKcal - fixedKcal;
          perMl = product.kcal;
        } else if (autoType === "protein" && product.bielk > 0) {
          remaining = goalProtein.max - fixedProtein; // target upper protein goal
          perMl = product.bielk;
        }
        const autoSpeed = calculateAutoSpeed(autoType, remaining, perMl, hours);
        const speedStr =
          autoSpeed > 0
            ? autoSpeed.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")
            : "";

        const ml = autoSpeed * hours;
        updatedPreparations[autoRowIndex] = {
          ...autoPrep,
          speed: speedStr,
          calculations: {
            ml: formatNum(ml, 1),
            kcal: formatNum(ml * product.kcal, 1),
            protein: formatNum(ml * product.bielk, 1),
            fat: formatNum(ml * product.tuk, 1),
            carb: formatNum(ml * product.cukry, 1),
          },
        };
      }
    }

    // --- 7. Totals from all rows (ml, kcal, protein, fat, carb) ---
    let totalMl = 0,
      totalKcal = 0,
      totalProtein = 0,
      totalFat = 0,
      totalCarb = 0;
    updatedPreparations.forEach((prep) => {
      const product = nutritionProducts.find((p) => p.name === prep.name) || {
        kcal: 0,
        bielk: 0,
        tuk: 0,
        cukry: 0,
      };
      const speed = safeParseFloat(prep.speed, 0);
      const hours = safeParseFloat(prep.hours, 24);

      const ml = speed * hours;
      totalMl += ml;
      totalKcal += ml * product.kcal;
      totalProtein += ml * product.bielk;
      totalFat += ml * product.tuk;
      totalCarb += ml * product.cukry;
    });

    // --- 8. Per-kg achieved (and macronutrient % of energy) ---
    let achKcalKg = 0,
      achProteinKg = 0,
      achFatKg = 0,
      achCarbKg = 0;
    let proteinPercent = 0,
      fatPercent = 0,
      carbPercent = 0;
    if (abw > 0) {
      achKcalKg = totalKcal / abw;
      achProteinKg = totalProtein / abw;
      achFatKg = totalFat / abw;
      achCarbKg = totalCarb / abw;

      if (achKcalKg > 0) {
        const proteinKcalKg = achProteinKg * 4;
        const fatKcalKg = achFatKg * 9;
        const carbKcalKg = achCarbKg * 4;
        proteinPercent = (proteinKcalKg / achKcalKg) * 100;
        fatPercent = (fatKcalKg / achKcalKg) * 100;
        carbPercent = (carbKcalKg / achKcalKg) * 100;
      }
    }

    // --- 9. Goal fulfillment: diffs and status classes ---
    const diffKcal = totalKcal - recGoalKcal;
    const diffProteinMin = totalProtein - goalProtein.min;
    const diffProteinMax = totalProtein - goalProtein.max;

    const epsilon = 0.05;
    const diffKcalClass = getKcalStatusClass(diffKcal, epsilon);
    const diffProteinClass = getStatusClass(
      totalProtein,
      goalProtein.min,
      goalProtein.max,
      epsilon,
    );

    let formattedDiffKcal = formatNum(diffKcal, 1);
    if (safeParseFloat(formattedDiffKcal, 0) === 0) {
      formattedDiffKcal = "0";
    } else if (diffKcal >= 0) {
      formattedDiffKcal = "+" + formattedDiffKcal;
    }

    let formattedDiffProteinMin = formatNum(diffProteinMin, 1);
    if (safeParseFloat(formattedDiffProteinMin, 0) === 0) {
      formattedDiffProteinMin = "0";
    } else if (diffProteinMin >= 0) {
      formattedDiffProteinMin = "+" + formattedDiffProteinMin;
    }

    let formattedDiffProteinMax = formatNum(diffProteinMax, 1);
    if (safeParseFloat(formattedDiffProteinMax, 0) === 0) {
      formattedDiffProteinMax = "0";
    } else if (diffProteinMax >= 0) {
      formattedDiffProteinMax = "+" + formattedDiffProteinMax;
    }

    // Fluid: optimal if total ml ≤ limit, deficit if over
    const fluidLimit = safeParseFloat(patientData.fluid_limit, 0);
    const mlClass =
      fluidLimit > 0 ? (totalMl <= fluidLimit ? "optimal" : "deficit") : "";

    setCalculations({
      ibw: formatNum(ibw, 2),
      abw: formatNum(abw, 2),
      bmi: formatNum(bmi, 1),
      full_goal_kcal: formatNum(fullGoalKcal, 1),
      rec_goal_kcal: formatNum(recGoalKcal, 1),
      ramp_percent: rampPercent,
      goal_protein: `${formatNum(goalProtein.min, 1)} - ${formatNum(goalProtein.max, 1)}`, // grams (min - max)
      total_ml: formatNum(totalMl, 1),
      total_kcal: formatNum(totalKcal, 1),
      total_protein: formatNum(totalProtein, 1),
      total_fat: formatNum(totalFat, 1),
      total_carb: formatNum(totalCarb, 1),
      ach_kcal_kg: formatNum(achKcalKg, 2),
      ach_protein_kg: formatNum(achProteinKg, 3),
      ach_fat_kg: formatNum(achFatKg, 3),
      ach_carb_kg: formatNum(achCarbKg, 3),
      ach_protein_percent: formatNum(proteinPercent, 0),
      ach_fat_percent: formatNum(fatPercent, 0),
      ach_carb_percent: formatNum(carbPercent, 0),
      diff_kcal: formattedDiffKcal,
      diff_protein_min: formattedDiffProteinMin,
      diff_protein_max: formattedDiffProteinMax,
      diff_kcal_class: diffKcalClass,
      diff_protein_class: diffProteinClass,
    });

    // Store totals separately for table footer
    setCalculations((prev) => ({
      ...prev,
      totals: {
        ml: formatNum(totalMl, 1),
        kcal: formatNum(totalKcal, 1),
        protein: formatNum(totalProtein, 1),
        fat: formatNum(totalFat, 1),
        carb: formatNum(totalCarb, 1),
        mlClass,
        kcalClass: diffKcalClass,
        proteinClass: diffProteinClass,
      },
    }));

    // Only update preparations if they've actually changed
    // Compare by stringifying to avoid unnecessary updates
    const currentPrepStr = JSON.stringify(currentPreparations);
    const updatedPrepStr = JSON.stringify(updatedPreparations);
    if (currentPrepStr !== updatedPrepStr) {
      isUpdatingRef.current = true;
      setPreparations(updatedPreparations);
    }
  }, [patientData, isFluidLimitManual]);

  useEffect(() => {
    updateCalculations();
  }, [updateCalculations]);

  // Also trigger calculations when preparations change (from user input)
  // Use a flag to prevent infinite loops when updateCalculations updates preparations
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }
    updateCalculations();
  }, [preparations, updateCalculations]);

  const handlePatientDataChange = (newData) => {
    setPatientData(newData);
  };

  const handlePreparationChange = (newPreparations) => {
    setPreparations(newPreparations);
  };

  const handleAddRow = () => {
    setPreparations([
      ...preparations,
      {
        name: "",
        autoKcal: false,
        autoProtein: false,
        speed: "",
        hours: 24,
        calculations: { ml: "0", kcal: "0", protein: "0", fat: "0", carb: "0" },
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setPreparations(preparations.filter((_, i) => i !== index));
  };

  const handleNewPatient = () => {
    setPatientData({
      patient_id: "",
      height: "",
      weight: "",
      gender: "M",
      day: 1,
      calorimeter: "NIE",
      ree: "",
      protein_goal_min: 1.5,
      protein_goal_max: 1.5,
      fluid_limit: "",
    });
    setPreparations([]);
    setPatientsList([]);
    setPatientHistory([]);
    setIsFluidLimitManual(false);
  };

  const handleListPatients = async () => {
    setLoadingPatients(true);
    setError(null);
    try {
      const response = await patientsAPI.getAll();
      setPatientsList(response.results || response);
      setLoadingPatients(false);
    } catch (err) {
      console.error("Failed to list patients:", err);
      setError(
        err.response?.data?.detail || t("messages.errorLoadingPatients"),
      );
      setLoadingPatients(false);
    }
  };

  const handleShowHistory = async (patientId) => {
    setLoadingHistory(true);
    setError(null);
    try {
      const patient = patientsList.find(
        (p) => p.patient_id === patientId || p.id === patientId,
      );
      if (!patient) {
        setError(t("messages.patientNotFound"));
        setLoadingHistory(false);
        return;
      }

      const patientIdForAPI = patient.id;
      const history = await patientsAPI.getHistory(patientIdForAPI);
      setPatientHistory(history);
      setCurrentPatient(patient);
      setLoadingHistory(false);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError(err.response?.data?.detail || t("messages.errorLoadingHistory"));
      setLoadingHistory(false);
    }
  };

  const handleLoadDay = async (day, patientID) => {
    setLoadingHistory(true);
    setError(null);
    try {
      const patient = patientsList.find(
        (p) => p.patient_id === patientID || p.id === patientID,
      );
      if (!patient) {
        setError(t("messages.patientNotFound"));
        setLoadingHistory(false);
        return;
      }

      const patientIdForAPI = patient.id;
      const patientFull = await patientsAPI.getById(patientIdForAPI);
      const dayData = await patientsAPI.getDay(patientIdForAPI, day);

      if (dayData) {
        setPatientData({
          patient_id: patientFull.patient_id,
          height:
            dayData.height != null && dayData.height !== ""
              ? safeParseFloat(dayData.height, 0)
              : (patientFull.height ?? ""),
          weight:
            dayData.weight != null && dayData.weight !== ""
              ? safeParseFloat(dayData.weight, 0)
              : (patientFull.weight ?? ""),
          gender: patientFull.gender || "M",
          day: dayData.day,
          calorimeter: dayData.calorimeter || "NIE",
          ree: dayData.ree ? dayData.ree.toString() : "",
          protein_goal_min: safeParseFloat(dayData.protein_goal_min, 1.5),
          protein_goal_max: safeParseFloat(dayData.protein_goal_max, 1.5),
          fluid_limit: dayData.fluid_limit
            ? dayData.fluid_limit.toString()
            : "",
        });
        setIsFluidLimitManual(
          dayData.fluid_limit !== null && dayData.fluid_limit !== "",
        );

        const preps = dayData.preparations || [];
        setPreparations(
          preps.map((p) => ({
            id: p.id,
            name: p.name || "",
            autoKcal: p.auto_kcal || false,
            autoProtein: p.auto_protein || false,
            speed: p.speed ? p.speed.toString() : "",
            hours: p.hours || 24,
            calculations: p.calculations || {
              ml: "0",
              kcal: "0",
              protein: "0",
              fat: "0",
              carb: "0",
            },
          })),
        );

        if (dayData.calculations) {
          setCalculations((prev) => ({ ...prev, ...dayData.calculations }));
        }

        setCurrentPatient(patientFull);
        setPatientsList([]);
        setPatientHistory([]);
        setSuccess(t("messages.loadDaySuccess", { day }));
      }
      setLoadingHistory(false);
    } catch (err) {
      console.error("Failed to load day:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          t("messages.errorLoading"),
      );
      setLoadingHistory(false);
    }
  };

  const handleDeletePatient = async (patientID) => {
    if (!window.confirm(t("messages.confirmDeletePatient", { id: patientID })))
      return;
    setLoadingPatients(true);
    setError(null);
    try {
      const patient = patientsList.find(
        (p) => p.patient_id === patientID || p.id === patientID,
      );
      if (!patient) {
        setError(t("messages.patientNotFound"));
        setLoadingPatients(false);
        return;
      }

      await patientsAPI.delete(patient.id);
      setSuccess("Pacient úspešne odstránený.");
      setLoadingPatients(false);
      handleListPatients();
    } catch (err) {
      console.error("Failed to delete patient:", err);
      setError(err.response?.data?.detail || t("messages.errorDeleting"));
      setLoadingPatients(false);
    }
  };

  const handleDeleteDay = async (patientID, day) => {
    if (!window.confirm(t("messages.confirmDeleteDay", { day, id: patientID })))
      return;
    setLoadingHistory(true);
    setError(null);
    try {
      const patient = patientsList.find(
        (p) => p.patient_id === patientID || p.id === patientID,
      );
      if (!patient) {
        setError(t("messages.patientNotFound"));
        setLoadingHistory(false);
        return;
      }

      const dayRecord = patientHistory.find((d) => d.day === day);
      if (!dayRecord) {
        setError("Deň nebol nájdený");
        setLoadingHistory(false);
        return;
      }

      await patientDaysAPI.delete(dayRecord.id);
      setSuccess(t("messages.deleteDaySuccess"));
      setLoadingHistory(false);
      handleShowHistory(patientID);
    } catch (err) {
      console.error("Failed to delete day:", err);
      setError(err.response?.data?.detail || "Chyba pri odstraňovaní dňa");
      setLoadingHistory(false);
    }
  };

  const handleSavePatient = async () => {
    if (!patientData.patient_id) {
      setError(t("messages.enterPatientId"));
      return;
    }

    setLoadingSave(true);
    setError(null);

    try {
      // Check if patient exists, if not create it
      let patient;
      const existingPatients = await patientsAPI.getAll();
      const existingPatient = (
        existingPatients.results || existingPatients
      ).find((p) => p.patient_id === patientData.patient_id);

      if (existingPatient) {
        patient = existingPatient;
      } else {
        // Create new patient
        patient = await patientsAPI.create({
          patient_id: patientData.patient_id,
          height: patientData.height || "",
          weight: patientData.weight || "",
          gender: patientData.gender || "M",
        });
      }

      // Check if day exists
      let dayRecord;
      try {
        dayRecord = await patientsAPI.getDay(patient.id, patientData.day);
      } catch (err) {
        // Day doesn't exist (404) or other error - will create new one
        if (err.response?.status === 404) {
          dayRecord = null;
        } else {
          // Re-throw non-404 errors
          throw err;
        }
      }

      // If day record exists, show confirmation modal
      if (dayRecord) {
        setLoadingSave(false);
        const confirmed = await new Promise((resolve) => {
          confirmResolveRef.current = resolve;
          setConfirmModal({
            isOpen: true,
            message: t("messages.confirmOverwrite"),
            onConfirm: () => {
              if (confirmResolveRef.current) {
                confirmResolveRef.current(true);
                confirmResolveRef.current = null;
              }
              setConfirmModal({ isOpen: false, message: "", onConfirm: null });
            },
          });
        });
        if (!confirmed) {
          return;
        }
        setLoadingSave(true);
      }

      // Prepare day data
      const dayData = {
        patient: patient.id,
        day: parseInt(patientData.day) || 1,
        height:
          patientData.height != null && patientData.height !== ""
            ? safeParseFloat(patientData.height, 0)
            : null,
        weight:
          patientData.weight != null && patientData.weight !== ""
            ? safeParseFloat(patientData.weight, 0)
            : null,
        calorimeter: patientData.calorimeter || "NIE",
        ree: patientData.ree ? safeParseFloat(patientData.ree, 0) : null,
        protein_goal_min: safeParseFloat(patientData.protein_goal_min, 1.5),
        protein_goal_max: safeParseFloat(patientData.protein_goal_max, 1.5),
        fluid_limit: patientData.fluid_limit
          ? safeParseFloat(patientData.fluid_limit, 0)
          : null,
        calculations: calculations || {},
        preparations: preparations
          .filter((p) => p && p.name)
          .map((p, index) => ({
            name: p.name,
            auto_kcal: p.autoKcal || false,
            auto_protein: p.autoProtein || false,
            speed:
              p.speed != null && p.speed !== ""
                ? safeParseFloat(p.speed, 0)
                : null,
            hours: safeParseFloat(p.hours, 24),
            order: index,
            calculations: p.calculations || {},
          })),
      };

      if (dayRecord) {
        // Update existing day
        await patientDaysAPI.update(dayRecord.id, dayData);
        setSuccess("Záznam úspešne aktualizovaný.");
      } else {
        // Create new day
        await patientDaysAPI.create(dayData);
        setSuccess(t("messages.saveSuccess"));
      }

      setCurrentPatient(patient);
      setLoadingSave(false);
    } catch (err) {
      console.error("Failed to save:", err);
      const errorMsg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0]?.[0] ||
        "Chyba pri ukladaní záznamu";
      setError(errorMsg);
      setLoadingSave(false);
    }
  };

  const handleExportPDF = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!patientData || !patientData.patient_id) {
        setError(t("messages.enterPatientId"));
        return;
      }
      exportToPDF(
        patientData,
        calculations,
        preparations,
        patientHistory,
        language,
      );
      setSuccess(t("messages.exportPdfSuccess"));
    } catch (err) {
      console.error("Failed to export PDF:", err);
      setError(
        t("messages.errorExporting") + ": " + (err.message || "Unknown error"),
      );
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(
        patientData,
        calculations,
        preparations,
        patientHistory,
        language,
      );
      setSuccess(t("messages.exportCsvSuccess"));
    } catch (err) {
      console.error("Failed to export CSV:", err);
      setError(t("messages.errorExporting"));
    }
  };

  // Filter patients based on search query and update last_day for current patient
  const filteredPatientsList = patientsList
    .map((patient) => {
      // If this is the current patient being edited, update last_day with the current day value
      if (
        patientData.patient_id &&
        patient.patient_id === patientData.patient_id
      ) {
        return {
          ...patient,
          last_day: patientData.day || patient.last_day || 0,
        };
      }
      return patient;
    })
    .filter((patient) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const patientId = patient.patient_id?.toLowerCase() || "";
      const gender = patient.gender?.toLowerCase() || "";
      const daysCount = (patient.days_count || 0).toString();
      return (
        patientId.includes(query) ||
        gender.includes(query) ||
        daysCount.includes(query)
      );
    });

  useEffect(() => {
    if (patientData.fluid_limit === "") {
      setIsFluidLimitManual(false);
    }
  }, [patientData.fluid_limit]);

  return (
    <div className="font-sans mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 bg-gray-100 dark:bg-[#0f0f0f] text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header with responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 sm:gap-3">
            <DarkModeToggle />
            <LanguageToggle />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {user && (
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {t("nav.loggedInAs")}:{" "}
              <strong className="break-all sm:break-normal">
                {user.username}
              </strong>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm hover:shadow transition-shadow duration-200 rounded-xl dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
      <h1 className="text-center text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
        {t("nav.nutritionCalculator")}
      </h1>
      <p className="italic text-gray-600 dark:text-gray-400 text-center mt-2 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base px-2">
        {t("nav.subtitle")}
      </p>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />

      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/20">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="tracking-wide">ZDRAVOTNÝ SYSTÉM</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Údaje pacienta
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Komplexné spravovanie zdravotných záznamov s presnosťou a
            starostlivosťou
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={handleNewPatient}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
            </svg>
            <span>Nový pacient</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={handleListPatients}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110 duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Zobraziť zoznam pacientov</span>
          </button>
        </div>
        <PatientHistory
          patientsList={filteredPatientsList}
          patientHistory={patientHistory}
          loadingPatients={loadingPatients}
          loadingHistory={loadingHistory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onShowHistory={handleShowHistory}
          onLoadDay={handleLoadDay}
          onDeletePatient={handleDeletePatient}
          onDeleteDay={handleDeleteDay}
        />

        <PatientForm
          patientData={{
            ...patientData,
            calculations,
            onFluidLimitChange: (value) => setIsFluidLimitManual(value !== ""),
          }}
          onPatientDataChange={handlePatientDataChange}
          onNewPatient={handleNewPatient}
          onListPatients={handleListPatients}
        />

        <DailyGoals
          calculations={calculations}
          selectedProteinPreset={patientData.selected_protein_preset}
        />

        <PreparationsTable
          preparations={preparations}
          totals={calculations.totals}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onPreparationChange={handlePreparationChange}
          isDarkMode={isDarkMode}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch sm:items-center justify-center">
            <button
              id="save_patient"
              type="button"
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-500 disabled:cursor-not-allowed text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base min-h-[44px]"
              onClick={handleSavePatient}
              disabled={loadingSave}
            >
              {loadingSave ? (
                <>
                  <span
                    className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0"
                    aria-hidden
                  />
                  <span>{t("common.saving", "Ukladám...")}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="truncate">
                    {t("messages.saveCurrentDay", {
                      defaultValue: "Save current patient day",
                    })}
                  </span>
                </>
              )}
            </button>

            {patientData.patient_id && calculations.total_kcal && (
              <>
                <button
                  onClick={handleExportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                  title="Export to PDF"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">{t("export.exportPdf")}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                  title="Export to CSV"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate">{t("export.exportCsv")}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <GoalFulfillment calculations={calculations} />

        <PerKgCalculations calculations={calculations} />

        <RampGraph
          patientData={patientData}
          calculations={calculations}
          isDarkMode={isDarkMode}
        />
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          if (confirmResolveRef.current) {
            confirmResolveRef.current(false);
            confirmResolveRef.current = null;
          }
          setConfirmModal({ isOpen: false, message: "", onConfirm: null });
        }}
        onConfirm={confirmModal.onConfirm || (() => {})}
        message={confirmModal.message}
        title={t("messages.confirmOverwrite")?.split("?")[0] || "Potvrdenie"}
        confirmText={language === "sk" ? "Potvrdiť" : "Confirm"}
        cancelText={language === "sk" ? "Zrušiť" : "Cancel"}
      />
    </div>
  );
}

export default NutritionTracker;
