import React, { useState, useEffect, useRef } from "react";
import { proteinPresets } from "../../data/nutritionProducts";
import { safeParseFloat } from "../../utils/calculations";

const InlineDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex w-full items-center justify-between rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/10"
      >
        <span className="flex-1 text-left">{selected.label || label}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 origin-top-right rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`block w-full px-4 py-3 text-left text-sm transition-colors duration-150 ${
                  selected.value === opt.value
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function PatientForm({
  patientData,
  onPatientDataChange,
  onNewPatient,
  onListPatients,
}) {
  const handleChange = (field, value) => {
    onPatientDataChange({ ...patientData, [field]: value });
  };

  const handlePresetClick = (min, max, label) => {
    onPatientDataChange({
      ...patientData,
      protein_goal_min: min,
      protein_goal_max: max,
      selected_protein_preset: label,
    });
  };

  const genderOptions = [
    { value: "M", label: "Muž" },
    { value: "F", label: "Žena" },
  ];

  const calorimeterOptions = [
    { value: "NIE", label: "NIE" },
    { value: "ÁNO", label: "ÁNO" },
  ];

  return (
    <div className="min-h-screen py-6 px-1 sm:py-10">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-teal-400/10 dark:bg-teal-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-8xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
          {/* Patient ID Section */}
          <div className="pb-8 border-b-2 border-gray-100 dark:border-gray-700/50">
            <label className="block text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Identifikátor pacienta
            </label>
            <input
              type="text"
              value={patientData.patient_id || ""}
              onChange={(e) => handleChange("patient_id", e.target.value)}
              placeholder="napr. PAC001"
              className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Basic Measurements Grid */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              Základné merania
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Height */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 2v20m0-20l-4 4m4-4l4 4m-4 16l-4-4m4 4l4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Výška (cm)
                </label>
                <input
                  type="number"
                  value={patientData.height || ""}
                  onChange={(e) =>
                    handleChange("height", safeParseFloat(e.target.value, 0))
                  }
                  min="100"
                  step="1"
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="10" r="3" />
                    <path
                      d="M12 13c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Aktuálna váha (kg)
                </label>
                <input
                  type="number"
                  value={patientData.weight || ""}
                  onChange={(e) =>
                    handleChange("weight", safeParseFloat(e.target.value, 0))
                  }
                  min="0"
                  step="1"
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Pohlavie
                </label>
                <InlineDropdown
                  label="Pohlavie"
                  options={genderOptions}
                  value={patientData.gender || "M"}
                  onChange={(val) => handleChange("gender", val)}
                />
              </div>

              {/* Hospital Day */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Deň hospitalizácie
                </label>
                <input
                  type="number"
                  value={patientData.day ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleChange("day", "");
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue)) {
                        handleChange("day", numValue);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (
                      e.target.value === "" ||
                      isNaN(parseInt(e.target.value, 10))
                    ) {
                      handleChange("day", 1);
                    }
                  }}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>

          {/* Advanced Measurements */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              Pokročilé parametre
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Calorimeter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Máme kalorimeter?
                </label>
                <InlineDropdown
                  label="Máme kalorimeter?"
                  options={calorimeterOptions}
                  value={patientData.calorimeter || "NIE"}
                  onChange={(val) => handleChange("calorimeter", val)}
                />
              </div>

              {/* REE */}
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${
                    patientData.calorimeter === "ÁNO"
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  REE (kcal/deň)
                </label>
                <input
                  type="number"
                  value={patientData.ree || ""}
                  onChange={(e) =>
                    handleChange("ree", safeParseFloat(e.target.value, 0))
                  }
                  min="0"
                  step="1"
                  disabled={patientData.calorimeter !== "ÁNO"}
                  className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    patientData.calorimeter === "ÁNO"
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Protein Goal */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Cieľ bielkoviny (g/kg/d)
                </label>
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    type="number"
                    value={patientData.protein_goal_min ?? 1.5}
                    onChange={(e) => {
                      handleChange(
                        "protein_goal_min",
                        safeParseFloat(e.target.value, 1.5),
                      );
                      handleChange("selected_protein_preset", "");
                    }}
                    min="0"
                    step="0.1"
                    className="w-16 min-w-0 px-2 py-2 text-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-gray-400 dark:text-gray-600 font-bold text-sm">
                    —
                  </span>
                  <input
                    type="number"
                    value={patientData.protein_goal_max ?? 1.5}
                    onChange={(e) => {
                      handleChange(
                        "protein_goal_max",
                        safeParseFloat(e.target.value, 1.5),
                      );
                      handleChange("selected_protein_preset", "");
                    }}
                    min="0"
                    step="0.1"
                    className="w-16 min-w-0 px-2 py-2 text-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Fluid Limit */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Limit tekutiny (ml)
                </label>
                <input
                  type="number"
                  value={patientData.fluid_limit || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("fluid_limit", value);
                    if (patientData.onFluidLimitChange) {
                      patientData.onFluidLimitChange(value);
                    }
                  }}
                  min="0"
                  step="100"
                  placeholder="bez limitu"
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>

          {/* ESPEN Guidelines Section */}
          <div className="pt-8 border-t-2 border-gray-100 dark:border-gray-700/50">
            <div className="mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                ESPEN Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-7">
                Prednastavené rozsahy bielkovín podľa klinických odporúčaní
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {proteinPresets.map((preset, index) => (
                <button
                  key={index}
                  className={`group px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    patientData.selected_protein_preset === preset.label
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/40"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md"
                  }`}
                  onClick={() =>
                    handlePresetClick(preset.min, preset.max, preset.label)
                  }
                >
                  <span className="block text-center">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculations Display */}
          <div className="pt-8 border-t-2 border-gray-100 dark:border-gray-700/50">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 sm:p-6 border-2 border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Vypočítané hodnoty
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* IBW */}
                <div className="group bg-white dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-emerald-500 hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Ideálna váha (IBW)
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {patientData.calculations?.ibw || "0"}
                    <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium ml-2">
                      kg
                    </span>
                  </p>
                </div>

                {/* ABW */}
                <div className="group bg-white dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Adjusted Body Weight (ABW)
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {patientData.calculations?.abw || "0"}
                    <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium ml-2">
                      kg
                    </span>
                  </p>
                </div>

                {/* BMI */}
                <div className="group bg-white dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-cyan-500 hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Body Mass Index
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {patientData.calculations?.bmi || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientForm;
