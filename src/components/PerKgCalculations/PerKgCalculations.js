import React from "react";

function PerKgCalculations({ calculations }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-5 sm:p-6 mb-6 sm:mb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-violet-500/20 mb-3">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M3 6h18M3 12h18m-7 6h7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3v4m0 14v-4M17 3v4m0 14v-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="tracking-wide">NA KG ABW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Prepočty na kg/deň
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (na ABW – adjusted body weight)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* kcal/kg/d */}
        <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Energia
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                kcal/kg/deň
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {calculations?.ach_kcal_kg ?? "0"}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                  kcal/kg/d
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Protein/kg/d */}
        <div className="group bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-4 border-2 border-violet-100 dark:border-violet-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Bielkoviny
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                g/kg/deň · % kcal
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {calculations?.ach_protein_kg ?? "0"}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                  g/kg/d
                </span>
              </p>
              <span className="inline-flex items-center bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-full text-xs font-semibold mt-2">
                {calculations?.ach_protein_percent ?? "0"}% kcal
              </span>
            </div>
          </div>
        </div>

        {/* Fat/kg/d */}
        <div className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border-2 border-amber-100 dark:border-amber-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Tuky
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                g/kg/deň · % kcal
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {calculations?.ach_fat_kg ?? "0"}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                  g/kg/d
                </span>
              </p>
              <span className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold mt-2">
                {calculations?.ach_fat_percent ?? "0"}% kcal
              </span>
            </div>
          </div>
        </div>

        {/* Carb/kg/d */}
        <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border-2 border-emerald-100 dark:border-emerald-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Cukry
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                g/kg/deň · % kcal
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {calculations?.ach_carb_kg ?? "0"}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                  g/kg/d
                </span>
              </p>
              <span className="inline-flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mt-2">
                {calculations?.ach_carb_percent ?? "0"}% kcal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              d="M12 16v-4M12 8h.01"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Všetky hodnoty na kg ABW
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              ABW (adjusted body weight) = upravená telesná hmotnosť podľa
              Devine; percentá kcal = podiel makroživiny na celkovej energii.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerKgCalculations;
