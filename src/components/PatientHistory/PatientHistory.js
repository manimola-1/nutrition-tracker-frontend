import React from "react";
import { formatNum, safeParseFloat } from "../../utils/calculations";
import { useLanguage } from "../../contexts/LanguageContext";

function PatientHistory({
  patientsList,
  patientHistory,
  loadingPatients = false,
  loadingHistory = false,
  searchQuery = "",
  onSearchChange,
  onShowHistory,
  onLoadDay,
  onDeletePatient,
  onDeleteDay,
}) {
  const { t } = useLanguage();

  const tableHeaderClass =
    "bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm first:rounded-tl-xl last:rounded-tr-xl";
  const tableCellClass =
    "p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm text-gray-800 dark:text-gray-200";
  const tableRowHover =
    "hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150";

  const SkeletonCell = ({ className = "" }) => (
    <td
      className={`p-1.5 sm:p-2 md:p-2.5 border-b border-gray-200 dark:border-gray-600 ${className}`}
    >
      <div className="h-4 sm:h-5 bg-gray-200/80 dark:bg-gray-600/80 rounded animate-pulse mx-auto max-w-[80%]" />
    </td>
  );

  const renderPatientsListSkeleton = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
          aria-hidden
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t("patientHistory.loadingPatients", "Načítavam zoznam pacientov...")}
        </span>
      </div>
      <div className="h-12 bg-gray-200/80 dark:bg-gray-600/80 rounded-xl animate-pulse w-full max-w-md mb-4" />
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={tableHeaderClass}>
                {t("patientHistory.patientId")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.lastDay")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.daysCount")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                  <div className="flex gap-2 justify-center">
                    <div className="h-8 w-24 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHistoryTableSkeleton = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
          aria-hidden
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t("patientHistory.loadingHistory", "Načítavam históriu...")}
        </span>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={tableHeaderClass}>{t("patientHistory.day")}</th>
              <th className={tableHeaderClass}>
                {t("patientHistory.totalKcal")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.goalKcal")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.totalProtein")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.goalProtein")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.fulfillmentKcal")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.fulfillmentProtein")}
              </th>
              <th className={tableHeaderClass}>
                {t("patientHistory.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800/50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i}>
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <SkeletonCell />
                <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                  <div className="flex gap-2 justify-center">
                    <div className="h-8 w-20 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatientsList = () => {
    if (loadingPatients) return renderPatientsListSkeleton();
    if (!patientsList || patientsList.length === 0) return null;

    // Group patients and count days
    const patients = {};
    patientsList.forEach((patient) => {
      const patientId = patient.patient_id || patient.id;
      if (!patients[patientId]) {
        patients[patientId] = {
          id: patient.id,
          patient_id: patient.patient_id,
          days_count: patient.days_count || 0,
          last_day: patient.last_day || 0,
          created_at: patient.created_at,
        };
      }
    });

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="tracking-wide">ZOZNAM PACIENTOV</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            História pacientov
          </h2>
        </div>

        <div className="mb-5">
          <div className="relative">
            <input
              type="text"
              placeholder={t("patientHistory.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {t("patientHistory.searchHelper")}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={tableHeaderClass}>
                  {t("patientHistory.patientId")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.lastDay")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.daysCount")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800/50">
              {Object.entries(patients).map(([id, info]) => (
                <tr key={id} className={tableRowHover}>
                  <td
                    className={`${tableCellClass} font-medium text-gray-900 dark:text-gray-100`}
                  >
                    {info.patient_id}
                  </td>
                  <td className={tableCellClass}>{info.last_day}</td>
                  <td className={tableCellClass}>{info.days_count}</td>
                  <td className={tableCellClass}>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap"
                        onClick={() => onShowHistory(info.patient_id)}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t("patientHistory.showHistory")}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap"
                        onClick={() => onDeletePatient(info.patient_id)}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        {t("patientHistory.deletePatient")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPatientHistory = () => {
    if (loadingHistory) return renderHistoryTableSkeleton();
    if (!patientHistory || patientHistory.length === 0) return null;

    const patientID = patientHistory[0]?.patient;
    const days = [];
    const kcal = [];
    const protein = [];
    let sum_diff_kcal = 0;
    let sum_diff_protein_min = 0;
    let sum_diff_protein_max = 0;
    let sum_total_protein = 0;
    let sum_goal_protein_min = 0;
    let sum_goal_protein_max = 0;
    const epsilon = 0.05;

    const historyRows = patientHistory.map((dayRecord) => {
      const calc = dayRecord.calculations || {};
      const totalKcalNum = safeParseFloat(calc.total_kcal, 0);
      const recGoalKcalNum = safeParseFloat(calc.rec_goal_kcal, 0);
      const totalProteinNum = safeParseFloat(calc.total_protein, 0);
      const goalProteinStr = calc.goal_protein || "0 - 0";
      let goalProteinMin, goalProteinMax;
      if (goalProteinStr.includes("-")) {
        [goalProteinMin, goalProteinMax] = goalProteinStr
          .split("-")
          .map((s) => safeParseFloat(s.trim(), 0));
      } else {
        goalProteinMin = goalProteinMax = safeParseFloat(goalProteinStr, 0);
      }
      const fulfillmentKcalPercent =
        recGoalKcalNum > 0 ? (totalKcalNum / recGoalKcalNum) * 100 : 0;
      const fulfillmentProteinPercent =
        goalProteinMax > 0 ? (totalProteinNum / goalProteinMax) * 100 : 0;

      const diffKcalStr = calc.diff_kcal || "0";
      const diffKcalNum = safeParseFloat(diffKcalStr.replace(/^\+/, ""), 0);
      let classKcal = "text-green-600 dark:text-green-400 font-bold";
      if (diffKcalNum < -epsilon)
        classKcal = "text-red-600 dark:text-red-400 font-bold";
      else if (diffKcalNum >= 200)
        classKcal = "text-orange-600 dark:text-orange-400 font-bold";

      let classProtein = "text-green-600 dark:text-green-400 font-bold";
      if (totalProteinNum < goalProteinMin - epsilon)
        classProtein = "text-red-600 dark:text-red-400 font-bold";
      else if (totalProteinNum > goalProteinMax + epsilon)
        classProtein = "text-orange-600 dark:text-orange-400 font-bold";

      days.push(dayRecord.day);
      kcal.push(totalKcalNum);
      protein.push(totalProteinNum);
      sum_diff_kcal += diffKcalNum;
      sum_diff_protein_min += totalProteinNum - goalProteinMin;
      sum_diff_protein_max += totalProteinNum - goalProteinMax;
      sum_total_protein += totalProteinNum;
      sum_goal_protein_min += goalProteinMin;
      sum_goal_protein_max += goalProteinMax;

      return (
        <tr key={dayRecord.id || dayRecord.day} className={tableRowHover}>
          <td
            className={`${tableCellClass} font-medium text-gray-900 dark:text-gray-100`}
          >
            {dayRecord.day}
          </td>
          <td className={`${tableCellClass} ${classKcal}`}>
            {calc.total_kcal || "0"}
          </td>
          <td className={tableCellClass}>{calc.rec_goal_kcal || "0"}</td>
          <td className={`${tableCellClass} ${classProtein}`}>
            {calc.total_protein || "0"}
          </td>
          <td className={tableCellClass}>{calc.goal_protein || "0"}</td>
          <td className={tableCellClass}>
            {formatNum(fulfillmentKcalPercent, 0)}%
          </td>
          <td className={tableCellClass}>
            {formatNum(fulfillmentProteinPercent, 0)}%
          </td>
          <td className={tableCellClass}>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap"
                onClick={() => onLoadDay(dayRecord.day, patientID)}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {t("patientHistory.load")}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap"
                onClick={() => onDeleteDay(patientID, dayRecord.day)}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t("patientHistory.deleteDay")}
              </button>
            </div>
          </td>
        </tr>
      );
    });

    const numDays = patientHistory.length;
    let classKcalCum = "text-green-600 dark:text-green-400 font-bold";
    if (sum_diff_kcal < -epsilon)
      classKcalCum = "text-red-600 dark:text-red-400 font-bold";
    else if (sum_diff_kcal >= 200 * numDays)
      classKcalCum = "text-orange-600 dark:text-orange-400 font-bold";

    let cumProteinClass = "text-green-600 dark:text-green-400 font-bold";
    if (sum_total_protein < sum_goal_protein_min - epsilon)
      cumProteinClass = "text-red-600 dark:text-red-400 font-bold";
    else if (sum_total_protein > sum_goal_protein_max + epsilon)
      cumProteinClass = "text-orange-600 dark:text-orange-400 font-bold";

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="tracking-wide">HISTÓRIA DŇOV</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t("patientHistory.historyFor")} {patientID}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={tableHeaderClass}>{t("patientHistory.day")}</th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.totalKcal")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.goalKcal")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.totalProtein")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.goalProtein")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.fulfillmentKcal")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.fulfillmentProtein")}
                </th>
                <th className={tableHeaderClass}>
                  {t("patientHistory.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800/50">
              {historyRows}
            </tbody>
          </table>
        </div>

        {numDays > 0 && (
          <div className="mt-6 p-4 sm:p-5 bg-blue-50/70 dark:bg-gray-900/50 rounded-xl border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {t("patientHistory.cumulativeBalance")} — {numDays}{" "}
                {t("patientHistory.days")}
              </h4>
            </div>
            <div className="space-y-2.5">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {t("patientHistory.cumulativeEnergyDiff")}:{" "}
                <span className={`font-semibold ${classKcalCum}`}>
                  {(sum_diff_kcal >= 0 ? "+" : "") +
                    formatNum(sum_diff_kcal, 1)}{" "}
                  kcal
                </span>
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {t("patientHistory.cumulativeProteinDiffMin")}:{" "}
                <span className={`font-semibold ${cumProteinClass}`}>
                  {(sum_diff_protein_min >= 0 ? "+" : "") +
                    formatNum(sum_diff_protein_min, 1)}{" "}
                  g
                </span>
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {t("patientHistory.cumulativeProteinDiffMax")}:{" "}
                <span className={`font-semibold ${cumProteinClass}`}>
                  {(sum_diff_protein_max >= 0 ? "+" : "") +
                    formatNum(sum_diff_protein_max, 1)}{" "}
                  g
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderPatientsList()}
      {renderPatientHistory()}
    </>
  );
}

export default PatientHistory;
