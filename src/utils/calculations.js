/** Format number to fixed decimals and return as string (e.g. for display). */
export function formatNum(num, decimals = 1) {
    return parseFloat(num.toFixed(decimals)).toString();
}

/** Ideal body weight (kg) – Devine formula, height in cm. */
export function calculateIBW(height, gender) {
    if (height <= 0) return 0;
    return gender === 'M'
        ? 50 + 0.91 * (height - 152.4)
        : 45.5 + 0.91 * (height - 152.4);
}

/** BMI from height (cm) and weight (kg). */
export function calculateBMI(height, weight) {
    if (height <= 0) return 0;
    return weight / Math.pow(height / 100, 2);
}

/** Adjusted body weight (kg). If weight > IBW use (weight + 2*IBW)/3, else use weight. */
export function calculateABW(weight, ibw) {
    if (ibw > 0 && weight > ibw) {
        return (weight + 2 * ibw) / 3;
    }
    return weight;
}

/** Full daily kcal goal: REE if calorimeter, else 25 kcal/kg ABW. */
export function calculateFullGoalKcal(abw, hasCalorimeter, ree) {
    if (hasCalorimeter && ree > 0) {
        return ree;
    }
    return 25 * abw;
}

/** Ramp percent by hospitalization day: 1→0%, 2→33%, 3→66%, 4–7→100% or 70%, 8+→100%. */
export function calculateRampPercent(day, hasCalorimeter) {
    if (day === 1) return 0;
    if (day === 2) return 33;
    if (day === 3) return 66;
    if (day >= 4 && day <= 7) return hasCalorimeter ? 100 : 70;
    return 100;
}

/**
 * Protein goal in grams per day: min and max from (g/kg × ABW).
 * Returns { min, max } in grams.
 */
export function calculateGoalProtein(proteinMinKg, proteinMaxKg, abw) {
    return {
        min: proteinMinKg * abw,
        max: proteinMaxKg * abw
    };
}

/** Infusion speed (ml/h) to reach remaining kcal or protein over given hours; perMl = kcal or protein per ml. */
export function calculateAutoSpeed(autoType, remaining, perMl, hours) {
    if (hours <= 0 || perMl <= 0) return 0;
    if (remaining < 0) remaining = 0;
    const mlNeeded = remaining / perMl;
    return mlNeeded / hours;
}

/** Status class for a value in [min, max]: deficit (below), optimal (in range), excess (above). */
export function getStatusClass(value, min, max, epsilon = 0.05) {
    if (value < min - epsilon) return 'deficit';
    if (value > max + epsilon) return 'excess';
    return 'optimal';
}

/** Status class for kcal difference: deficit if below -epsilon, excess if ≥200 kcal over. */
export function getKcalStatusClass(diffKcal, epsilon = 0.05) {
    if (diffKcal < -epsilon) return 'deficit';
    if (diffKcal >= 200) return 'excess';
    return 'optimal';
}
