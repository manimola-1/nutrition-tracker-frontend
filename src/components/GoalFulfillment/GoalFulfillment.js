import React from 'react';
import { safeParseFloat } from '../../utils/calculations';

function GoalFulfillment({ calculations }) {
    const getCardStyles = (status) => {
        if (status === 'deficit')
            return {
                card: 'from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 border-rose-100 dark:border-rose-900/50',
                icon: 'from-rose-500 to-red-500',
            };
        if (status === 'excess')
            return {
                card: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/50',
                icon: 'from-amber-500 to-orange-500',
            };
        return {
            card: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50',
            icon: 'from-emerald-500 to-teal-500',
        };
    };

    const kcalStatus = calculations?.diff_kcal_class ?? 'optimal';
    const proteinStatus = calculations?.diff_protein_class ?? 'optimal';
    const diffMinNum = safeParseFloat(calculations?.diff_protein_min, 0);
    const diffMaxNum = safeParseFloat(calculations?.diff_protein_max, 0);
    const proteinMinStatus = diffMinNum < 0 ? 'deficit' : proteinStatus;
    const proteinMaxStatus = diffMaxNum > 0 ? 'excess' : 'optimal';

    const kcalStyles = getCardStyles(kcalStatus);
    const proteinMinStyles = getCardStyles(proteinMinStatus);
    const proteinMaxStyles = getCardStyles(proteinMaxStatus);

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-emerald-500/20 mb-3">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="tracking-wide">PLNENIE CIEĽA</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Plnenie cieľa
                </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {/* Energy diff */}
                <div className={`group bg-gradient-to-br ${kcalStyles.card} rounded-xl p-4 border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${kcalStyles.icon} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Rozdiel energia
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">vs. odporúčaný cieľ</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                <span className={kcalStatus === 'deficit' ? 'text-rose-600 dark:text-rose-400' : kcalStatus === 'excess' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                    {calculations?.diff_kcal ?? '0'}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">kcal</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Protein vs min */}
                <div className={`group bg-gradient-to-br ${proteinMinStyles.card} rounded-xl p-4 border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${proteinMinStyles.icon} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Bielkoviny vs. dolný
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">vs. dolný cieľ (min)</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                <span className={proteinMinStatus === 'deficit' ? 'text-rose-600 dark:text-rose-400' : proteinMinStatus === 'excess' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                    {calculations?.diff_protein_min ?? '0'}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">g</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Protein vs max */}
                <div className={`group bg-gradient-to-br ${proteinMaxStyles.card} rounded-xl p-4 border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${proteinMaxStyles.icon} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Bielkoviny vs. horný
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">vs. horný cieľ (max)</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                <span className={proteinMaxStatus === 'deficit' ? 'text-rose-600 dark:text-rose-400' : proteinMaxStatus === 'excess' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                    {calculations?.diff_protein_max ?? '0'}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">g</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Význam farieb
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            <span className="text-rose-600 dark:text-rose-400 font-semibold">Červená</span> = deficit (pod cieľom) ·{' '}
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zelená</span> = okolo cieľa ·{' '}
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">Oranžová</span> = nadmerné (nad cieľom)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoalFulfillment;
