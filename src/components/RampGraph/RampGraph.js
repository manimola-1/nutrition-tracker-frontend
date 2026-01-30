import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { rampData } from '../../data/nutritionProducts';
import { formatNum } from '../../utils/calculations';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function RampGraph({ patientData, calculations, isDarkMode }) {
    const { t } = useLanguage();
    const hasCal = patientData?.calorimeter === 'ÁNO';
    const day = parseInt(patientData?.day) || 1;
    const fullGoalKcal = parseFloat(calculations?.full_goal_kcal) || 0;
    const totalKcal = parseFloat(calculations?.total_kcal) || 0;
    const recGoalKcal = parseFloat(calculations?.rec_goal_kcal) || 0;

    // Get ramp curve data
    const curve = hasCal ? rampData.IC : rampData.PR;
    const days = Array.from({ length: 10 }, (_, i) => i + 1);
    const rampPercentages = days.map((_, i) => curve[i] || 0);

    // Calculate achieved percentage
    const achievedPercent = fullGoalKcal > 0 ? (totalKcal / fullGoalKcal) * 100 : 0;
    const currentDayIndex = Math.min(Math.max(day, 1), 10) - 1;

    // Prepare data points for achieved value
    const achievedData = days.map((d, i) => {
        if (i === currentDayIndex) {
            return achievedPercent;
        }
        return null;
    });

    // Chart data
    const chartData = {
        labels: days,
        datasets: [
            {
                label: t('rampGraph.plannedRampUp'),
                data: rampPercentages,
                borderColor: isDarkMode ? '#4da6ff' : '#007bff',
                backgroundColor: isDarkMode ? 'rgba(77, 166, 255, 0.1)' : 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
            },
            {
                label: t('rampGraph.achieved'),
                data: achievedData,
                borderColor: isDarkMode ? '#ff6b6b' : '#d63031',
                backgroundColor: (() => {
                    const diffKcal = totalKcal - recGoalKcal;
                    if (diffKcal < 0) {
                        return isDarkMode ? 'rgba(255, 107, 107, 0.8)' : 'rgba(214, 48, 49, 0.8)';
                    } else if (diffKcal >= 200) {
                        return isDarkMode ? 'rgba(255, 183, 77, 0.8)' : 'rgba(230, 126, 34, 0.8)';
                    }
                    return isDarkMode ? 'rgba(0, 230, 118, 0.8)' : 'rgba(0, 184, 148, 0.8)';
                })(),
                borderWidth: 0,
                pointRadius: 8,
                pointHoverRadius: 10,
                pointBackgroundColor: (() => {
                    const diffKcal = totalKcal - recGoalKcal;
                    if (diffKcal < 0) {
                        return isDarkMode ? '#ff6b6b' : '#d63031';
                    } else if (diffKcal >= 200) {
                        return isDarkMode ? '#ffb74d' : '#e67e22';
                    }
                    return isDarkMode ? '#00e676' : '#00b894';
                })(),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: isDarkMode ? '#e0e0e0' : '#333',
                    font: {
                        size: 12
                    },
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDarkMode ? '#e0e0e0' : '#333',
                bodyColor: isDarkMode ? '#e0e0e0' : '#333',
                borderColor: isDarkMode ? '#4da6ff' : '#007bff',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 1 && context.parsed.y !== null) {
                            return `${t('rampGraph.achieved')}: ${formatNum(context.parsed.y, 1)}%`;
                        }
                        return `${context.dataset.label}: ${formatNum(context.parsed.y, 1)}%`;
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('patientHistory.day'),
                    color: isDarkMode ? '#e0e0e0' : '#333',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: isDarkMode ? '#bbb' : '#666',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: '% z plného cieľa', // Keep as is - technical term
                    color: isDarkMode ? '#e0e0e0' : '#333',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                min: 0,
                max: 120,
                ticks: {
                    stepSize: 20,
                    color: isDarkMode ? '#bbb' : '#666',
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-3 sm:mb-4">
                {t('rampGraph.title')}
            </h2>
            <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                <div style={{ height: '300px', minHeight: '300px' }} className="sm:h-[350px] md:h-[400px]">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('rampGraph.plannedRampUp')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('rampGraph.optimal')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('rampGraph.deficit')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('rampGraph.excess')}</span>
                </div>
            </div>
            <p className="italic text-gray-600 dark:text-gray-400 text-center mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm px-2">
                Graf ukazuje plánovaný ramp-up % z plného cieľa (modrá čiara) pre dni 1-10. 
                Bod označuje dosiahnuté % pre aktuálny deň ({day}).
            </p>
        </div>
    );
}

export default RampGraph;
