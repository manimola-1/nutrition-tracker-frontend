import React from 'react';
import ProductDropdown from '../ProductDropdown/ProductDropdown';

function PreparationsTable({ 
    preparations, 
    totals,
    onAddRow, 
    onRemoveRow, 
    onPreparationChange,
    isDarkMode 
}) {
    const handleAutoCheck = (index, type) => {
        const clickedPrep = preparations[index];
        const isCurrentlyChecked = clickedPrep[type];
        
        const newPreparations = preparations.map((prep, i) => {
            if (i === index) {
                // For the clicked row: toggle the clicked checkbox and uncheck the other one
                const willBeChecked = !isCurrentlyChecked;
                if (type === 'autoKcal') {
                    return { 
                        ...prep, 
                        autoKcal: willBeChecked, 
                        autoProtein: false,
                        // Reset speed to 0 when checkbox is checked
                        speed: willBeChecked ? 0 : prep.speed
                    };
                } else {
                    return { 
                        ...prep, 
                        autoKcal: false, 
                        autoProtein: willBeChecked,
                        // Reset speed to 0 when checkbox is checked
                        speed: willBeChecked ? 0 : prep.speed
                    };
                }
            } else {
                // For all other rows: uncheck both checkboxes
                return { ...prep, autoKcal: false, autoProtein: false };
            }
        });
        onPreparationChange(newPreparations);
    };

    const handleFieldChange = (index, field, value) => {
        const newPreparations = [...preparations];
        newPreparations[index] = { ...newPreparations[index], [field]: value };
        onPreparationChange(newPreparations);
    };

    const getStatusClasses = (status) => {
        if (status === 'deficit') return 'text-red-600 dark:text-red-400 font-bold';
        if (status === 'excess') return 'text-orange-600 dark:text-orange-400 font-bold';
        if (status === 'optimal') return 'text-green-600 dark:text-green-400 font-bold';
        return '';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">Podané prípravky</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto mb-2 sm:mb-3" onClick={onAddRow}>Pridať prípravok</button>
            <p className="italic text-gray-600 dark:text-gray-400 text-center mt-2 mb-3 sm:mb-4 text-xs sm:text-sm px-2">
                Zaškrtnite presne jeden riadok „Auto kcal" alebo „Auto proteín" – aplikácia dopočíta rýchlosť tak, 
                aby celkové kcal alebo proteíny dosiahli <strong>odporúčaný cieľ podľa dňa</strong>. 
                Len jeden auto môže byť aktívny.
            </p>

            <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                <div className="inline-block min-w-full align-middle">
                    <table id="prep_table" className="min-w-full border-separate border-spacing-0 mt-3 sm:mt-4 md:mt-5 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                        <thead>
                            <tr>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap sticky left-0 z-10">Názov prípravku</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Auto kcal</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Auto proteín</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Rýchlosť (ml/h)</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Počet hodín</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">ml (per specified hours)</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">kcal</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Bielkoviny (g)</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Tuky (g)</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Cukry (g)</th>
                                <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap">Akcie</th>
                            </tr>
                        </thead>
                    <tbody>
                        {preparations.map((prep, index) => (
                            <tr key={index} className={`${prep.autoKcal || prep.autoProtein ? 'bg-green-50 dark:bg-gray-700' : ''} hover:bg-blue-50 dark:hover:bg-gray-700`}>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[120px] sm:min-w-[150px] sticky left-0 z-10 bg-inherit">
                                    <ProductDropdown
                                        value={prep.name || ''}
                                        onChange={(name) => handleFieldChange(index, 'name', name)}
                                        isDarkMode={isDarkMode}
                                    />
                                </td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={prep.autoKcal || false}
                                        onChange={() => handleAutoCheck(index, 'autoKcal')}
                                        className="w-auto scale-110 sm:scale-125 cursor-pointer"
                                        aria-label="Auto kcal"
                                    />
                                </td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={prep.autoProtein || false}
                                        onChange={() => handleAutoCheck(index, 'autoProtein')}
                                        className="w-auto scale-110 sm:scale-125 cursor-pointer"
                                        aria-label="Auto proteín"
                                    />
                                </td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={prep.speed || ''}
                                        onChange={(e) => {
                                            // Prevent increase when either checkbox is checked
                                            if (prep.autoKcal || prep.autoProtein) {
                                                return; // Do nothing if checkbox is checked
                                            }
                                            handleFieldChange(index, 'speed', parseFloat(e.target.value) || 0);
                                        }}
                                        disabled={prep.autoKcal || prep.autoProtein}
                                        className={`w-full min-w-[70px] sm:min-w-[80px] p-1.5 sm:p-2 md:p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-[10px] sm:text-xs md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 ${prep.autoKcal || prep.autoProtein ? 'bg-green-50 dark:bg-gray-700 font-bold cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                                    />
                                </td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="24"
                                        value={prep.hours || 24}
                                        onChange={(e) => handleFieldChange(index, 'hours', parseInt(e.target.value) || 24)}
                                        className="w-full min-w-[50px] sm:min-w-[60px] p-1.5 sm:p-2 md:p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-[10px] sm:text-xs md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    />
                                </td>
                                <td id="total_ml" className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${getStatusClasses(totals?.mlClass || '')}`}>
                                {totals?.ml || '0'}
                            </td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{prep.calculations?.kcal || '0'}</td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{prep.calculations?.protein || '0'}</td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{prep.calculations?.fat || '0'}</td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{prep.calculations?.carb || '0'}</td>
                                <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap" onClick={() => onRemoveRow(index)}>
                                        <span className="hidden sm:inline">Odstrániť</span>
                                        <span className="sm:hidden">×</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-blue-50 dark:bg-gray-700/90 font-bold text-xs sm:text-sm md:text-lg border-t-2 border-gray-200 dark:border-gray-600">
                            <td colSpan="5" className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600">Celkom</td>
                            <td id="total_ml" className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${getStatusClasses(totals?.mlClass || '')}`}>
                                {totals?.ml || '0'}
                            </td>
                            <td id="total_kcal" className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${getStatusClasses(totals?.kcalClass || '')}`}>
                                {totals?.kcal || '0'}
                            </td>
                            <td id="total_protein" className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm ${getStatusClasses(totals?.proteinClass || '')}`}>
                                {totals?.protein || '0'}
                            </td>
                            <td id="total_fat" className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{totals?.fat || '0'}</td>
                            <td id="total_carb" className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm">{totals?.carb || '0'}</td>
                            <td className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600"></td>
                        </tr>
                    </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PreparationsTable;
