/**
 * Translation strings for Slovak and English
 */

export const translations = {
  sk: {
    // Common
    common: {
      save: "Uložiť",
      cancel: "Zrušiť",
      delete: "Odstrániť",
      edit: "Upraviť",
      close: "Zavrieť",
      search: "Hľadať",
      loading: "Načítavanie...",
      error: "Chyba",
      success: "Úspech",
      confirm: "Potvrdiť",
      yes: "Áno",
      no: "Nie",
      logout: "Odhlásiť sa",
      login: "Prihlásiť sa",
      register: "Registrovať sa",
      forgotPassword: "Zabudli ste heslo?",
      backToLogin: "Späť na prihlásenie",
    },

    // Navigation & Headers
    nav: {
      loggedInAs: "Prihlásený ako",
      nutritionCalculator:
        "Kalkulačka parenterálnej a enterálnej výživy pre KAIM",
      subtitle:
        "Automatické dopočítanie rýchlosti v označenom riadku na odporúčaný cieľ kcal a proteínu podľa dňa hospitalizácie.",
    },

    // Patient Form
    patientForm: {
      patientId: "ID pacienta",
      height: "Výška (cm)",
      weight: "Hmotnosť (kg)",
      gender: "Pohlavie",
      genderMale: "Muž",
      genderFemale: "Žena",
      day: "Deň",
      calorimeter: "Kalorimeter",
      calorimeterYes: "ÁNO",
      calorimeterNo: "NIE",
      ree: "REE",
      proteinGoalMin: "Cieľ proteínu min (g/kg)",
      proteinGoalMax: "Cieľ proteínu max (g/kg)",
      fluidLimit: "Limit tekutín (ml)",
      newPatient: "Nový pacient",
      listPatients: "Zoznam pacientov",
    },

    // Patient History
    patientHistory: {
      searchPlaceholder: "Hľadať podľa ID, počtu dní alebo posledného dňa...",
      searchHelper:
        "Vyhľadávanie pacientov podľa ID, počtu dní alebo posledného dňa. Výsledky sa aktualizujú automaticky počas písania.",
      patientId: "ID pacienta",
      lastDay: "Posledný deň",
      daysCount: "Počet dní",
      actions: "Akcie",
      showHistory: "Zobraziť históriu",
      deletePatient: "Odstrániť",
      historyFor: "História pre",
      day: "Deň",
      totalKcal: "Total kcal",
      goalKcal: "Cieľ kcal",
      totalProtein: "Total proteín",
      goalProtein: "Cieľ proteín",
      fulfillmentKcal: "% plnenia (kcal)",
      fulfillmentProtein: "% plnenia (proteín)",
      load: "Načítať",
      deleteDay: "Odstrániť deň",
      cumulativeBalance: "Kumulatívne bilancie za",
      days: "dní",
      cumulativeEnergyDiff: "Kumulatívny rozdiel energie",
      cumulativeProteinDiffMin:
        "Kumulatívny rozdiel bielkovín (vs. dolný cieľ)",
      cumulativeProteinDiffMax:
        "Kumulatívny rozdiel bielkovín (vs. horný cieľ)",
    },

    // Preparations
    preparations: {
      preparation: "Príprava",
      speed: "Rýchlosť",
      hours: "Hodiny",
      ml: "ML",
      kcal: "Kcal",
      protein: "Proteín",
      fat: "Tuk",
      carbs: "Sacharidy",
      addRow: "Pridať riadok",
      removeRow: "Odstrániť riadok",
      totals: "Celkom",
    },

    // Daily Goals
    dailyGoals: {
      title: "Denné ciele",
      fullGoalKcal: "Plný cieľ kcal",
      recGoalKcal: "Odporúčaný cieľ kcal",
      goalProtein: "Cieľ proteín",
      rampPercent: "Ramp percent",
    },

    // Goal Fulfillment
    goalFulfillment: {
      title: "Plnenie cieľov",
      kcal: "Kcal",
      protein: "Proteín",
    },

    // Per Kg Calculations
    perKgCalculations: {
      title: "Výpočty na kg",
      kcalPerKg: "Kcal/kg",
      proteinPerKg: "Proteín/kg",
    },

    // Ramp Graph
    rampGraph: {
      title: "Graf ramp-up kalorického cieľa",
      plannedRampUp: "Plánovaný ramp-up (%)",
      achieved: "Dosiahnuté (%)",
      description:
        "Graf ukazuje plánovaný ramp-up % z plného cieľa (modrá čiara) pre dni 1-10. Bod označuje dosiahnuté % pre aktuálny deň",
      optimal: "Optimálne dosiahnuté",
      deficit: "Deficit",
      excess: "Prekročenie",
    },

    // Messages
    messages: {
      enterPatientId: "Zadajte ID pacienta!",
      patientNotFound: "Pacient nebol nájdený",
      dayNotFound: "Deň nebol nájdený",
      saveSuccess: "Záznam úspešne uložený.",
      updateSuccess: "Záznam úspešne aktualizovaný.",
      deleteSuccess: "Pacient úspešne odstránený.",
      deleteDaySuccess: "Deň úspešne odstránený.",
      loadDaySuccess: "Dáta pre deň {day} úspešne načítané.",
      exportPdfSuccess: "PDF úspešne exportovaný.",
      exportCsvSuccess: "CSV úspešne exportovaný.",
      confirmDeletePatient: "Odstrániť všetky dáta pre pacienta {id}?",
      confirmDeleteDay: "Odstrániť deň {day} pre pacienta {id}?",
      confirmOverwrite: "Záznam pre tento deň už existuje. Prepísať?",
      confirmLogout: "Naozaj sa chcete odhlásiť?",
      saveCurrentDay: "Uložiť aktuálny deň pacienta",
      errorLoading: "Chyba pri načítaní",
      errorSaving: "Chyba pri ukladaní záznamu",
      errorDeleting: "Chyba pri odstraňovaní",
      errorExporting: "Chyba pri exportovaní",
      errorLoadingPatients: "Chyba pri načítaní zoznamu pacientov",
      errorLoadingHistory: "Chyba pri načítaní histórie",
      resetPasswordSuccess:
        "Inštrukcie na obnovenie hesla boli odoslané na váš email.",
      resetPasswordError:
        "Chyba pri obnovení hesla. Skontrolujte prosím svoje údaje.",
    },

    // Export
    export: {
      exportPdf: "Exportovať PDF",
      exportCsv: "Exportovať CSV",
      reportTitle: "Nutrition Tracker Report",
      patientInformation: "Patient Information",
      calculations: "Calculations",
      preparations: "Preparations",
      totals: "Totals",
      patientHistory: "Patient History",
      value: "Value",
      unit: "Unit",
    },

    // Forgot Password
    forgotPassword: {
      title: "Obnovenie hesla",
      subtitle:
        "Zadajte svoj email a my vám pošleme inštrukcie na obnovenie hesla",
      email: "Email",
      emailPlaceholder: "Zadajte svoj email",
      sendInstructions: "Odoslať inštrukcie",
      sending: "Odosielam...",
      rememberPassword: "Pamätáte si heslo?",
      backToLogin: "Späť na prihlásenie",
    },

    // Reset Password (new password form from email link)
    resetPassword: {
      title: "Nastaviť nové heslo",
      subtitle: "Zadajte nové heslo pre váš účet",
      enterNewPassword: "Zadajte nové heslo a jeho potvrdenie",
      newPassword: "Nové heslo",
      newPasswordPlaceholder: "Zadajte nové heslo (min. 8 znakov)",
      confirmPassword: "Potvrdenie hesla",
      confirmPasswordPlaceholder: "Zopakujte nové heslo",
      submit: "Nastaviť heslo",
      submitting: "Ukladám...",
      success: "Heslo bolo úspešne zmenené.",
      error: "Nepodarilo sa zmeniť heslo. Skúste to znova.",
      invalidToken: "Neplatný alebo expirovaný odkaz. Požiadajte o nový odkaz na obnovenie hesla.",
      passwordsDoNotMatch: "Heslá sa nezhodujú.",
      passwordTooShort: "Heslo musí mať aspoň 8 znakov.",
      rememberPassword: "Pamätáte si heslo?",
      backToLogin: "Späť na prihlásenie",
    },
  },

  en: {
    // Common
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search: "Search",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      logout: "Logout",
      login: "Login",
      register: "Register",
      forgotPassword: "Forgot password?",
      backToLogin: "Back to login",
    },

    // Navigation & Headers
    nav: {
      loggedInAs: "Logged in as",
      nutritionCalculator:
        "Parenteral and Enteral Nutrition Calculator for KAIM",
      subtitle:
        "Automatic calculation of speed in the marked row to the recommended kcal and protein goal according to the day of hospitalization.",
    },

    // Patient Form
    patientForm: {
      patientId: "Patient ID",
      height: "Height (cm)",
      weight: "Weight (kg)",
      gender: "Gender",
      genderMale: "Male",
      genderFemale: "Female",
      day: "Day",
      calorimeter: "Calorimeter",
      calorimeterYes: "YES",
      calorimeterNo: "NO",
      ree: "REE",
      proteinGoalMin: "Protein goal min (g/kg)",
      proteinGoalMax: "Protein goal max (g/kg)",
      fluidLimit: "Fluid limit (ml)",
      newPatient: "New Patient",
      listPatients: "List Patients",
    },

    // Patient History
    patientHistory: {
      searchPlaceholder: "Search by Patient ID, Number of Days, or Last Day...",
      searchHelper:
        "Search patients by Patient ID, Number of Days, or Last Day. Results will update automatically as you type.",
      patientId: "Patient ID",
      lastDay: "Last Day",
      daysCount: "Days Count",
      actions: "Actions",
      showHistory: "Show History",
      deletePatient: "Delete",
      historyFor: "History for",
      day: "Day",
      totalKcal: "Total kcal",
      goalKcal: "Goal kcal",
      totalProtein: "Total protein",
      goalProtein: "Goal protein",
      fulfillmentKcal: "% fulfillment (kcal)",
      fulfillmentProtein: "% fulfillment (protein)",
      load: "Load",
      deleteDay: "Delete Day",
      cumulativeBalance: "Cumulative balance for",
      days: "days",
      cumulativeEnergyDiff: "Cumulative energy difference",
      cumulativeProteinDiffMin:
        "Cumulative protein difference (vs. lower goal)",
      cumulativeProteinDiffMax:
        "Cumulative protein difference (vs. upper goal)",
    },

    // Preparations
    preparations: {
      preparation: "Preparation",
      speed: "Speed",
      hours: "Hours",
      ml: "ML",
      kcal: "Kcal",
      protein: "Protein",
      fat: "Fat",
      carbs: "Carbs",
      addRow: "Add Row",
      removeRow: "Remove Row",
      totals: "Totals",
    },

    // Daily Goals
    dailyGoals: {
      title: "Daily Goals",
      fullGoalKcal: "Full Goal Kcal",
      recGoalKcal: "Recommended Goal Kcal",
      goalProtein: "Goal Protein",
      rampPercent: "Ramp Percent",
    },

    // Goal Fulfillment
    goalFulfillment: {
      title: "Goal Fulfillment",
      kcal: "Kcal",
      protein: "Protein",
    },

    // Per Kg Calculations
    perKgCalculations: {
      title: "Per Kg Calculations",
      kcalPerKg: "Kcal/kg",
      proteinPerKg: "Protein/kg",
    },

    // Ramp Graph
    rampGraph: {
      title: "Calorie Goal Ramp-up Graph",
      plannedRampUp: "Planned ramp-up (%)",
      achieved: "Achieved (%)",
      description:
        "The graph shows the planned ramp-up % of the full goal (blue line) for days 1-10. The point indicates the achieved % for the current day",
      optimal: "Optimal achieved",
      deficit: "Deficit",
      excess: "Excess",
    },

    // Messages
    messages: {
      enterPatientId: "Enter patient ID!",
      patientNotFound: "Patient not found",
      dayNotFound: "Day not found",
      saveSuccess: "Record successfully saved.",
      updateSuccess: "Record successfully updated.",
      deleteSuccess: "Patient successfully deleted.",
      deleteDaySuccess: "Day successfully deleted.",
      loadDaySuccess: "Data for day {day} successfully loaded.",
      exportPdfSuccess: "PDF successfully exported.",
      exportCsvSuccess: "CSV successfully exported.",
      confirmDeletePatient: "Delete all data for patient {id}?",
      confirmDeleteDay: "Delete day {day} for patient {id}?",
      confirmOverwrite: "Record for this day already exists. Overwrite?",
      confirmLogout: "Are you sure you want to logout?",
      saveCurrentDay: "Save current patient day",
      errorLoading: "Error loading",
      errorSaving: "Error saving record",
      errorDeleting: "Error deleting",
      errorExporting: "Error exporting",
      errorLoadingPatients: "Error loading patient list",
      errorLoadingHistory: "Error loading history",
      resetPasswordSuccess:
        "Password reset instructions have been sent to your email.",
      resetPasswordError:
        "Error resetting password. Please check your information.",
    },

    // Export
    export: {
      exportPdf: "Export PDF",
      exportCsv: "Export CSV",
      reportTitle: "Nutrition Tracker Report",
      patientInformation: "Patient Information",
      calculations: "Calculations",
      preparations: "Preparations",
      totals: "Totals",
      patientHistory: "Patient History",
      value: "Value",
      unit: "Unit",
    },

    // Forgot Password
    forgotPassword: {
      title: "Reset Password",
      subtitle:
        "Enter your email and we'll send you instructions to reset your password",
      email: "Email",
      emailPlaceholder: "Enter your email",
      sendInstructions: "Send Instructions",
      sending: "Sending...",
      rememberPassword: "Remember your password?",
      backToLogin: "Back to login",
    },

    // Reset Password (new password form from email link)
    resetPassword: {
      title: "Set new password",
      subtitle: "Enter a new password for your account",
      enterNewPassword: "Enter your new password and confirmation",
      newPassword: "New password",
      newPasswordPlaceholder: "Enter new password (min. 8 characters)",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Repeat new password",
      submit: "Set password",
      submitting: "Saving...",
      success: "Password has been changed successfully.",
      error: "Failed to change password. Please try again.",
      invalidToken: "Invalid or expired link. Please request a new password reset link.",
      passwordsDoNotMatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 8 characters.",
      rememberPassword: "Remember your password?",
      backToLogin: "Back to login",
    },
  },
};

/**
 * Helper function to get nested translation
 */
export const getTranslation = (lang, path) => {
  const keys = path.split(".");
  let value = translations[lang];

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return path; // Return path if translation not found
    }
  }

  return typeof value === "string" ? value : path;
};

/**
 * Helper function to format translation with placeholders
 */
export const formatTranslation = (text, replacements = {}) => {
  let formatted = text;
  Object.entries(replacements).forEach(([key, value]) => {
    formatted = formatted.replace(`{${key}}`, value);
  });
  return formatted;
};
