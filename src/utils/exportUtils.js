/**
 * Utility functions for exporting patient data to PDF and CSV
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getTranslation } from '../i18n/translations';

/**
 * Export patient data to PDF
 */
export const exportToPDF = (patientData, calculations, preparations, patientHistory = [], language = 'sk') => {
    try {
        if (!patientData) {
            throw new Error('Patient data is required');
        }
        
        const doc = new jsPDF();
        const isDarkMode = document.documentElement.classList.contains('dark');
        const t = (path) => getTranslation(language, path);
        
        // Colors based on theme
        const textColor = isDarkMode ? [200, 200, 200] : [0, 0, 0];
        const headerColor = isDarkMode ? [55, 65, 81] : [59, 130, 246];
        
        // Title
        doc.setFontSize(18);
        doc.setTextColor(...headerColor);
        doc.text('Nutrition Tracker Report', 14, 20);
        
        // Patient Information
        doc.setFontSize(12);
        doc.setTextColor(...textColor);
        let yPos = 35;
        
        doc.text(`Patient ID: ${patientData.patient_id || 'N/A'}`, 14, yPos);
        yPos += 7;
        doc.text(`Height: ${patientData.height || 'N/A'} cm`, 14, yPos);
        yPos += 7;
        doc.text(`Weight: ${patientData.weight || 'N/A'} kg`, 14, yPos);
        yPos += 7;
        doc.text(`Gender: ${patientData.gender === 'M' ? 'Male' : 'Female'}`, 14, yPos);
        yPos += 7;
        doc.text(`Day: ${patientData.day || 'N/A'}`, 14, yPos);
        yPos += 10;
        
        // Calculations Table
        const calculationsData = [
            ['IBW', (calculations?.ibw || '0').toString(), 'kg'],
            ['ABW', (calculations?.abw || '0').toString(), 'kg'],
            ['BMI', (calculations?.bmi || '0').toString(), ''],
            ['Full Goal Kcal', (calculations?.full_goal_kcal || '0').toString(), 'kcal'],
            ['Recommended Goal Kcal', (calculations?.rec_goal_kcal || '0').toString(), 'kcal'],
            ['Ramp Percent', `${calculations?.ramp_percent || 0}%`, ''],
            ['Goal Protein', (calculations?.goal_protein || '0').toString(), 'g'],
        ];
        
        autoTable(doc, {
            head: [['Metric', 'Value', 'Unit']],
            body: calculationsData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
            styles: { textColor: textColor },
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
        
        // Preparations Table
        if (preparations && preparations.length > 0) {
            const prepData = preparations
                .filter(p => p && p.name)
                .map(p => [
                    p.name || '',
                    (p.speed || '0').toString(),
                    (p.hours || '24').toString(),
                    (p.calculations?.ml || '0').toString(),
                    (p.calculations?.kcal || '0').toString(),
                    (p.calculations?.protein || '0').toString(),
                ]);
            
            if (prepData.length > 0) {
                autoTable(doc, {
                    head: [['Preparation', 'Speed', 'Hours', 'ML', 'Kcal', 'Protein']],
                    body: prepData,
                    startY: yPos,
                    theme: 'grid',
                    headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
                    styles: { textColor: textColor },
                });
                
                yPos = doc.lastAutoTable.finalY + 10;
            }
            
            // Totals
            if (calculations?.totals) {
                const totalsData = [
                    ['Total ML', (calculations.totals.ml || '0').toString()],
                    ['Total Kcal', (calculations.totals.kcal || '0').toString()],
                    ['Total Protein', (calculations.totals.protein || '0').toString()],
                    ['Total Fat', (calculations.totals.fat || '0').toString()],
                    ['Total Carbs', (calculations.totals.carb || '0').toString()],
                ];
                
                autoTable(doc, {
                    head: [['Metric', t('preparations.totals')]],
                    body: totalsData,
                    startY: yPos,
                    theme: 'grid',
                    headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
                    styles: { textColor: textColor },
                });
            }
        }
        
        // Save PDF
        const filename = `patient_${patientData.patient_id || 'report'}_day_${patientData.day || '1'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    } catch (error) {
        console.error('Error in exportToPDF:', error);
        throw error;
    }
};

/**
 * Export patient data to CSV
 */
export const exportToCSV = (patientData, calculations, preparations, patientHistory = [], language = 'sk') => {
    const t = (path) => getTranslation(language, path);
    let csv = `${t('export.reportTitle')}\n\n`;
    
    // Patient Information
    csv += `${t('export.patientInformation')}\n`;
    csv += `Patient ID,${patientData.patient_id || 'N/A'}\n`;
    csv += `Height,${patientData.height || 'N/A'}\n`;
    csv += `Weight,${patientData.weight || 'N/A'}\n`;
    csv += `Gender,${patientData.gender === 'M' ? 'Male' : 'Female'}\n`;
    csv += `Day,${patientData.day}\n\n`;
    
    // Calculations
    csv += 'Calculations\n';
    csv += 'Metric,Value,Unit\n';
    csv += `IBW,${calculations.ibw || '0'},kg\n`;
    csv += `ABW,${calculations.abw || '0'},kg\n`;
    csv += `BMI,${calculations.bmi || '0'},\n`;
    csv += `Full Goal Kcal,${calculations.full_goal_kcal || '0'},kcal\n`;
    csv += `Recommended Goal Kcal,${calculations.rec_goal_kcal || '0'},kcal\n`;
    csv += `Ramp Percent,${calculations.ramp_percent || 0},%\n`;
    csv += `Goal Protein,${calculations.goal_protein || '0'},g\n\n`;
    
    // Preparations
    if (preparations && preparations.length > 0) {
        csv += 'Preparations\n';
        csv += 'Name,Speed,Hours,ML,Kcal,Protein,Fat,Carbs\n';
        preparations
            .filter(p => p && p.name)
            .forEach(p => {
                csv += `${p.name || ''},${p.speed || '0'},${p.hours || '24'},${p.calculations?.ml || '0'},${p.calculations?.kcal || '0'},${p.calculations?.protein || '0'},${p.calculations?.fat || '0'},${p.calculations?.carb || '0'}\n`;
            });
        csv += '\n';
        
        // Totals
        if (calculations.totals) {
            csv += 'Totals\n';
            csv += 'Metric,Value\n';
            csv += `Total ML,${calculations.totals.ml || '0'}\n`;
            csv += `Total Kcal,${calculations.totals.kcal || '0'}\n`;
            csv += `Total Protein,${calculations.totals.protein || '0'}\n`;
            csv += `Total Fat,${calculations.totals.fat || '0'}\n`;
            csv += `Total Carbs,${calculations.totals.carb || '0'}\n`;
        }
    }
    
    // Patient History
    if (patientHistory && patientHistory.length > 0) {
        csv += '\nPatient History\n';
        csv += 'Day,Date,Kcal,Protein\n';
        patientHistory.forEach(day => {
            const date = day.created_at ? new Date(day.created_at).toLocaleDateString() : 'N/A';
            csv += `${day.day},${date},${day.calculations?.rec_goal_kcal || '0'},${day.calculations?.total_protein || '0'}\n`;
        });
    }
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_${patientData.patient_id || 'report'}_day_${patientData.day}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
