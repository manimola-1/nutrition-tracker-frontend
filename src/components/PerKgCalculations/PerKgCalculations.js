import React from 'react';

function PerKgCalculations({ calculations }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
                Prepočty na kg/deň (na ABW)
            </h2>
            <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm md:text-base">
                    kcal/kg/d: <strong>{calculations?.ach_kcal_kg ?? '0'}</strong>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Bielkoviny/kg/d: <strong>{calculations?.ach_protein_kg ?? '0'}</strong>
                    <span className="text-gray-600 dark:text-gray-400">
                        {' '}({calculations?.ach_protein_percent ?? '0'}% kcal)
                    </span>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Tuky/kg/d: <strong>{calculations?.ach_fat_kg ?? '0'}</strong>
                    <span className="text-gray-600 dark:text-gray-400">
                        {' '}({calculations?.ach_fat_percent ?? '0'}% kcal)
                    </span>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Cukry/kg/d: <strong>{calculations?.ach_carb_kg ?? '0'}</strong>
                    <span className="text-gray-600 dark:text-gray-400">
                        {' '}({calculations?.ach_carb_percent ?? '0'}% kcal)
                    </span>
                </p>
            </div>
        </div>
    );
}

export default PerKgCalculations;
