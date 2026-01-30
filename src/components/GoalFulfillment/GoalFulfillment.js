import React from 'react';

function GoalFulfillment({ calculations }) {
    const getStatusClasses = (status) => {
        if (status === 'deficit') return 'text-red-600 dark:text-red-400 font-bold';
        if (status === 'excess') return 'text-orange-600 dark:text-orange-400 font-bold';
        return 'text-green-600 dark:text-green-400 font-bold';
    };

    const kcalClass = getStatusClasses(calculations?.diff_kcal_class ?? 'optimal');
    const proteinClass = getStatusClasses(calculations?.diff_protein_class ?? 'optimal');

    const diffMinNum = parseFloat(calculations?.diff_protein_min ?? '0');
    const diffMaxNum = parseFloat(calculations?.diff_protein_max ?? '0');
    const proteinMinClass = diffMinNum < 0 ? getStatusClasses('deficit') : proteinClass;
    const proteinMaxClass = diffMaxNum > 0 ? getStatusClasses('excess') : getStatusClasses('optimal');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-center text-gray-900 dark:text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
                Plnenie cieľa
                <span className="block sm:inline text-xs sm:text-sm md:text-base font-normal mt-1 sm:mt-0 px-2">
                    (deficit = červená, okolo cieľa = zelená, nadmerné = oranžová)
                </span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm md:text-base">
                    Rozdiel energia (vs. odporúčaný cieľ):{' '}
                    <strong>
                        <span className={kcalClass}>
                            {calculations?.diff_kcal ?? '0'} kcal
                        </span>
                    </strong>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Rozdiel bielkoviny (vs. dolný cieľ):{' '}
                    <strong>
                        <span className={proteinMinClass}>
                            {calculations?.diff_protein_min ?? '0'} g
                        </span>
                    </strong>
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                    Rozdiel bielkoviny (vs. horný cieľ):{' '}
                    <strong>
                        <span className={proteinMaxClass}>
                            {calculations?.diff_protein_max ?? '0'} g
                        </span>
                    </strong>
                </p>
            </div>
        </div>
    );
}

export default GoalFulfillment;
