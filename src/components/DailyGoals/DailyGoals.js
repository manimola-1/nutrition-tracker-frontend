import React from 'react';

/**
 * DailyGoals – shows daily energy and protein goals.
 * Protein goal is in grams (min–max) from calculations.goal_protein (ABW × g/kg range).
 */
function DailyGoals({ calculations, selectedProteinPreset }) {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-blue-500/20 mb-3">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="tracking-wide">DENNÉ PLÁNY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Denné ciele
                </h2>
            </div>

            {/* Goals Grid - Horizontal Wrap */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {/* Full Goal Energy */}
                <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Plný cieľ energia
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">(25 kcal/kg ABW)</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {calculations?.full_goal_kcal || '0'}
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">kcal/deň</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommended Goal Energy */}
                <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border-2 border-emerald-100 dark:border-emerald-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Odporúčaný cieľ
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Energia podľa dňa</p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    {calculations?.rec_goal_kcal || '0'}
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">kcal/deň</span>
                                </p>
                            </div>
                            <span className="inline-flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mt-2">
                                {calculations?.ramp_percent || '0'}% plnenia
                            </span>
                        </div>
                    </div>
                </div>

                {/* Protein Goal */}
                <div className="group bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-4 border-2 border-violet-100 dark:border-violet-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] md:col-span-2 xl:col-span-1">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Cieľ bielkoviny
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">(plný)</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {calculations?.goal_protein || '0 - 0'}
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">g/deň</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ramp Guidelines Info */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Ramp podľa guidelines
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            deň 1: 0% → 2: 33% → 3: 66% → 4–7: 100% (s kalorimetrom) / 70% (bez) → od 8: 100%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyGoals;