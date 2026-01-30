import React, { useState, useEffect, useRef } from 'react';
import { proteinPresets } from '../../data/nutritionProducts';

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

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block w-full sm:w-[270px]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex w-full items-center justify-between rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 px-4 py-2.5 h-[44px] text-sm font-semibold text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
            >
                <span className="mx-auto">{selected.label || label}</span>
                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                >
                    <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {open && (
            <div className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                    <div className="py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
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
    onListPatients 
}) {
    const handleChange = (field, value) => {
        onPatientDataChange({ ...patientData, [field]: value });
    };

    const handlePresetClick = (min, max, label) => {
        onPatientDataChange({
            ...patientData,
            protein_goal_min: min,
            protein_goal_max: max,
            selected_protein_preset: label
        });
    };

    const genderOptions = [
        { value: 'M', label: 'Muž' },
        { value: 'F', label: 'Žena' },
    ];

    const calorimeterOptions = [
        { value: 'NIE', label: 'NIE' },
        { value: 'ÁNO', label: 'ÁNO' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="text-center order-first">
                    <h2 className="m-0 text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Údaje pacienta</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full sm:w-auto justify-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto" onClick={onNewPatient}>Nový pacient</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto" onClick={onListPatients}>Zobraziť zoznam pacientov</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mb-4">
                <div>
                    <label className="block mb-1.5 font-semibold text-gray-800 dark:text-gray-200">ID pacienta</label>
                    <input
                        type="text"
                        value={patientData.patient_id || ''}
                        onChange={(e) => handleChange('patient_id', e.target.value)}
                        placeholder="napr. PAC001"
                        className="w-full max-w-full sm:max-w-[270px] p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4">
                <div>
                    <label className="block mb-1.5 font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm md:text-base">Výška (cm)</label>
                    <input
                        type="number"
                        value={patientData.height || ''}
                        onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                        min="100"
                        step="1"
                        className="w-full p-2.5 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                </div>
                <div>
                    <label className="block mb-1.5 font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm md:text-base">Aktuálna váha (kg)</label>
                    <input
                        type="number"
                        value={patientData.weight || ''}
                        onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                        className="w-full p-2.5 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                </div>
                <div className="space-y-2 mt-[1px]">
                    <label className="block text-xs sm:text-sm font-bold tracking-wide text-gray-800 dark:text-gray-200">
                        Pohlavie
                    </label>
                    <InlineDropdown
                        label="Pohlavie"
                        options={genderOptions}
                        value={patientData.gender || 'M'}
                        onChange={(val) => handleChange('gender', val)}
                    />
                </div>

                <div>
                    <label className="block mb-1.5 font-semibold text-xs sm:text-sm md:text-base">Deň hospitalizácie</label>
                    <input
                        type="number"
                        value={patientData.day ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow empty string while typing, parse to number when valid
                            if (value === '') {
                                handleChange('day', '');
                            } else {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue)) {
                                    handleChange('day', numValue);
                                }
                            }
                        }}
                        onBlur={(e) => {
                            // Set default to 1 if empty on blur
                            if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
                                handleChange('day', 1);
                            }
                        }}
                        min="1"
                        step="1"
                        className="w-full p-2.5 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 sm:gap-5 mb-4">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    Máme kalorimeter?
                </label>
                <div className="w-full sm:max-w-[220px]">
                    <InlineDropdown
                        label="Máme kalorimeter?"
                        options={calorimeterOptions}
                        value={patientData.calorimeter || 'NIE'}
                        onChange={(val) => handleChange('calorimeter', val)}
                    />
                </div>
            </div>

                <div className={patientData.calorimeter === 'ÁNO' ? '' : 'opacity-60'}>
                    <label className="block mb-1.5 font-semibold">REE (kcal/deň z kalorimetra)</label>
                    <input
                        type="number"
                        value={patientData.ree || ''}
                        onChange={(e) => handleChange('ree', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                        disabled={patientData.calorimeter !== 'ÁNO'}
                        className="w-full sm:max-w-[270px] p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base transition-all duration-200 mx-auto block bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:border-gray-300 dark:disabled:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block mb-1.5 font-semibold">Cieľ bielkoviny (g/kg/d)</label>
                    <div className="flex gap-1.5 items-center">
                        <input
                            type="number"
                            value={patientData.protein_goal_min || 1.5}
                            onChange={(e) => {
                                handleChange('protein_goal_min', parseFloat(e.target.value) || 1.5);
                                handleChange('selected_protein_preset', ''); // Clear preset when manually changed
                            }}
                            min="0"
                            step="0.1"
                            className="max-w-[125px] p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={patientData.protein_goal_max || 1.5}
                            onChange={(e) => {
                                handleChange('protein_goal_max', parseFloat(e.target.value) || 1.5);
                                handleChange('selected_protein_preset', ''); // Clear preset when manually changed
                            }}
                            min="0"
                            step="0.1"
                            className="max-w-[125px] p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1.5 font-semibold">Limit tekutiny (ml)</label>
                    <input
                        type="number"
                        value={patientData.fluid_limit || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            handleChange('fluid_limit', value);
                            if (patientData.onFluidLimitChange) {
                                patientData.onFluidLimitChange(value);
                            }
                        }}
                        min="0"
                        step="100"
                        placeholder="bez limitu"
                        className="w-full max-w-[342px] p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base transition-all duration-200 mx-auto block bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                </div>
            </div>

            <div className="mt-4 sm:mt-5">
                <h3 className="m-0 mb-3 sm:mb-4 text-left text-gray-900 dark:text-white text-lg sm:text-xl font-bold tracking-tight">Prednastavené rozsahy podľa ESPEN guidelines</h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center">
                    {proteinPresets.map((preset, index) => (
                        <button
                            key={index}
                            className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-none rounded-xl cursor-pointer shadow-sm hover:shadow transition-all duration-200 ${
                                patientData.selected_protein_preset === preset.label
                                    ? 'bg-blue-700 dark:bg-blue-800 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
                            }`}
                            onClick={() => handlePresetClick(preset.min, preset.max, preset.label)}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 p-5 bg-green-50 dark:bg-gray-700/80 rounded-xl border border-green-100 dark:border-gray-600">
                <p className="my-1">Ideálna váha (IBW): <strong><span id="ibw-display">{patientData.calculations?.ibw || '0'}</span> kg</strong></p>
                <p className="my-1">Adjusted body weight (ABW): <strong><span id="abw-display">{patientData.calculations?.abw || '0'}</span> kg</strong></p>
                <p className="my-1">BMI: <strong><span id="bmi-display">{patientData.calculations?.bmi || '0'}</span></strong></p>
            </div>
        </div>
    );
}

export default PatientForm;

