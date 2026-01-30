import React from 'react';

/**
 * DailyGoals – shows daily energy and protein goals.
 * Protein goal is in grams (min–max) from calculations.goal_protein (ABW × g/kg range).
 */
function DailyGoals({ calculations, selectedProteinPreset }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">Denné ciele</h2>
            <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm md:text-base">
                    Plný cieľ energia (25 kcal/kg ABW): <strong>
                        <span>{calculations?.full_goal_kcal || '0'}</span> kcal/deň
                    </strong>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Odporúčaný cieľ energia podľa dňa: <strong>
                        <span>{calculations?.rec_goal_kcal || '0'}</span> kcal/deň
                    </strong> (<span>{calculations?.ramp_percent || '0'}</span>% plnenia)
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Cieľ bielkoviny (plný): <strong>
                        <span>{calculations?.goal_protein || '0 - 0'}</span> g/deň
                    </strong>
                </p>
            </div>
            <p className="italic text-gray-600 dark:text-gray-400 text-center mt-2 sm:mt-3 md:mt-4 text-[10px] sm:text-xs md:text-sm px-2">
                Ramp podľa guidelines: deň 1: 0% → 2: 33% → 3: 66% → 4–7: 100% (s kalorimetrom) / 70% (bez) → od 8: 100%
            </p>
        </div>
    );
}

export default DailyGoals;
