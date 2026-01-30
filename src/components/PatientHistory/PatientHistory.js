import React from 'react';
import { formatNum } from '../../utils/calculations';
import { useLanguage } from '../../contexts/LanguageContext';

function PatientHistory({ 
    patientsList, 
    patientHistory, 
    searchQuery = '',
    onSearchChange,
    onShowHistory, 
    onLoadDay, 
    onDeletePatient, 
    onDeleteDay 
}) {
    const { t } = useLanguage();
    const renderPatientsList = () => {
        if (!patientsList || patientsList.length === 0) return null;

        // Group patients and count days
        const patients = {};
        patientsList.forEach(patient => {
            const patientId = patient.patient_id || patient.id;
            if (!patients[patientId]) {
                patients[patientId] = {
                    id: patient.id,
                    patient_id: patient.patient_id,
                    days_count: patient.days_count || 0,
                    last_day: patient.last_day || 0,
                    created_at: patient.created_at
                };
            }
        });

        return (
            <div className="mt-4 sm:mt-5">
                {/* Search Bar */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('patientHistory.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange && onSearchChange('')}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                        {t('patientHistory.searchHelper')}
                    </p>
                </div>
                
                <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                            <thead>
                                <tr>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm">{t('patientHistory.patientId')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm">{t('patientHistory.lastDay')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm">{t('patientHistory.daysCount')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm">{t('patientHistory.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(patients).map(([id, info]) => (
                                    <tr key={id} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                                        <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm font-medium">{info.patient_id}</td>
                                        <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{info.last_day}</td>
                                        <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{info.days_count}</td>
                                        <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 justify-center">
                                                <button className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap" onClick={() => onShowHistory(info.patient_id)}>
                                                    {t('patientHistory.showHistory')}
                                                </button>
                                                <button className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap" onClick={() => onDeletePatient(info.patient_id)}>
                                                    {t('patientHistory.deletePatient')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderPatientHistory = () => {
        if (!patientHistory || patientHistory.length === 0) return null;

        const patientID = patientHistory[0]?.patient
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

        const historyRows = patientHistory.map(dayRecord => {
            const calc = dayRecord.calculations || {};
            const totalKcalNum = parseFloat(calc.total_kcal) || 0;
            const recGoalKcalNum = parseFloat(calc.rec_goal_kcal) || 0;
            const totalProteinNum = parseFloat(calc.total_protein) || 0;
            const goalProteinStr = calc.goal_protein || '0 - 0';
            let goalProteinMin, goalProteinMax;
            if (goalProteinStr.includes('-')) {
                [goalProteinMin, goalProteinMax] = goalProteinStr.split('-').map(s => parseFloat(s.trim()));
            } else {
                goalProteinMin = goalProteinMax = parseFloat(goalProteinStr) || 0;
            }
            const fulfillmentKcalPercent = recGoalKcalNum > 0 ? (totalKcalNum / recGoalKcalNum) * 100 : 0;
            const fulfillmentProteinPercent = goalProteinMax > 0 ? (totalProteinNum / goalProteinMax) * 100 : 0;

            const diffKcalStr = calc.diff_kcal || '0';
            const diffKcalNum = parseFloat(diffKcalStr.replace(/^\+/, '')) || 0;
            let classKcal = 'text-green-600 dark:text-green-400 font-bold';
            if (diffKcalNum < -epsilon) classKcal = 'text-red-600 dark:text-red-400 font-bold';
            else if (diffKcalNum >= 200) classKcal = 'text-orange-600 dark:text-orange-400 font-bold';

            let classProtein = 'text-green-600 dark:text-green-400 font-bold';
            if (totalProteinNum < goalProteinMin - epsilon) classProtein = 'text-red-600 dark:text-red-400 font-bold';
            else if (totalProteinNum > goalProteinMax + epsilon) classProtein = 'text-orange-600 dark:text-orange-400 font-bold';

            days.push(dayRecord.day);
            kcal.push(totalKcalNum);
            protein.push(totalProteinNum);
            sum_diff_kcal += diffKcalNum;
            sum_diff_protein_min += (totalProteinNum - goalProteinMin);
            sum_diff_protein_max += (totalProteinNum - goalProteinMax);
            sum_total_protein += totalProteinNum;
            sum_goal_protein_min += goalProteinMin;
            sum_goal_protein_max += goalProteinMax;

            return (
                                <tr key={dayRecord.id || dayRecord.day} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm font-medium">{dayRecord.day}</td>
                                    <td className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${classKcal}`}>{calc.total_kcal || '0'}</td>
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{calc.rec_goal_kcal || '0'}</td>
                                    <td className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${classProtein}`}>{calc.total_protein || '0'}</td>
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{calc.goal_protein || '0'}</td>
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{formatNum(fulfillmentKcalPercent, 0)}%</td>
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{formatNum(fulfillmentProteinPercent, 0)}%</td>
                                    <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 justify-center">
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap" onClick={() => onLoadDay(dayRecord.day, patientID)}>{t('patientHistory.load')}</button>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap" onClick={() => onDeleteDay(patientID, dayRecord.day)}>{t('patientHistory.deleteDay')}</button>
                                        </div>
                                    </td>
                                </tr>
            );
        });

        const numDays = patientHistory.length;
        let classKcalCum = 'text-green-600 dark:text-green-400 font-bold';
        if (sum_diff_kcal < -epsilon) classKcalCum = 'text-red-600 dark:text-red-400 font-bold';
        else if (sum_diff_kcal >= 200 * numDays) classKcalCum = 'text-orange-600 dark:text-orange-400 font-bold';

        let cumProteinClass = 'text-green-600 dark:text-green-400 font-bold';
        if (sum_total_protein < sum_goal_protein_min - epsilon) cumProteinClass = 'text-red-600 dark:text-red-400 font-bold';
        else if (sum_total_protein > sum_goal_protein_max + epsilon) cumProteinClass = 'text-orange-600 dark:text-orange-400 font-bold';

        return (
            <div className="mt-4 sm:mt-5">
                <h3 className="mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 text-lg sm:text-xl font-semibold">{t('patientHistory.historyFor')} {patientID}</h3>
                <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                            <thead>
                                <tr>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.day')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.totalKcal')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.goalKcal')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.totalProtein')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.goalProtein')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.fulfillmentKcal')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.fulfillmentProtein')}</th>
                                    <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{t('patientHistory.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                {numDays > 0 && (
                    <div className="mt-4 sm:mt-5 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/80 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 className="mt-0 mb-2 text-gray-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">{t('patientHistory.cumulativeBalance')} {numDays} {t('patientHistory.days')}</h4>
                        <div className="space-y-2">
                            <p className="text-sm sm:text-base">
                                {t('patientHistory.cumulativeEnergyDiff')}: <span className={classKcalCum}>
                                    {(sum_diff_kcal >= 0 ? '+' : '') + formatNum(sum_diff_kcal, 1)} kcal
                                </span>
                            </p>
                            <p className="text-sm sm:text-base">
                                {t('patientHistory.cumulativeProteinDiffMin')}: <span className={cumProteinClass}>
                                    {(sum_diff_protein_min >= 0 ? '+' : '') + formatNum(sum_diff_protein_min, 1)} g
                                </span>
                            </p>
                            <p className="text-sm sm:text-base">
                                {t('patientHistory.cumulativeProteinDiffMax')}: <span className={cumProteinClass}>
                                    {(sum_diff_protein_max >= 0 ? '+' : '') + formatNum(sum_diff_protein_max, 1)} g
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
