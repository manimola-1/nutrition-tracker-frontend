import React from "react";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
import { safeParseFloat } from "../../utils/calculations";

function PreparationsTable({
  preparations,
  totals,
  onAddRow,
  onRemoveRow,
  onPreparationChange,
  isDarkMode,
}) {
  const handleAutoCheck = (index, type) => {
    const clickedPrep = preparations[index];
    const isCurrentlyChecked = clickedPrep[type];

    const newPreparations = preparations.map((prep, i) => {
      if (i === index) {
        // For the clicked row: toggle the clicked checkbox and uncheck the other one
        const willBeChecked = !isCurrentlyChecked;
        if (type === "autoKcal") {
          return {
            ...prep,
            autoKcal: willBeChecked,
            autoProtein: false,
            // Reset speed to 0 when checkbox is checked
            speed: willBeChecked ? 0 : prep.speed,
          };
        } else {
          return {
            ...prep,
            autoKcal: false,
            autoProtein: willBeChecked,
            // Reset speed to 0 when checkbox is checked
            speed: willBeChecked ? 0 : prep.speed,
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
    if (status === "deficit") return "text-red-600 dark:text-red-400 font-bold";
    if (status === "excess")
      return "text-orange-600 dark:text-orange-400 font-bold";
    if (status === "optimal")
      return "text-green-600 dark:text-green-400 font-bold";
    return "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <h2 className="text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
        Podané prípravky
      </h2>
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto mb-2 sm:mb-3"
        onClick={onAddRow}
      >
        Pridať prípravok
      </button>
      <p className="italic text-gray-600 dark:text-gray-400 text-center mt-2 mb-3 sm:mb-4 text-xs sm:text-sm px-2">
        Zaškrtnite presne jeden riadok „Auto kcal" alebo „Auto proteín" –
        aplikácia dopočíta rýchlosť tak, aby celkové kcal alebo proteíny
        dosiahli <strong>odporúčaný cieľ podľa dňa</strong>. Len jeden auto môže
        byť aktívny.
      </p>

      <div className="relative -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
        <div
          className="overflow-x-auto md:overflow-visible overflow-y-visible rounded-xl border border-gray-200 dark:border-gray-700 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="inline-block min-w-full align-middle md:min-w-0">
            <table
              id="prep_table"
              className="min-w-[680px] md:min-w-full w-full md:table-fixed border-separate border-spacing-0 mt-0 rounded-xl border-0 shadow-none md:shadow-md"
            >
              <thead>
                <tr>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words md:sticky md:left-0 md:z-20 min-w-[160px] sm:min-w-[180px] md:min-w-0 md:w-[18%] first:rounded-tl-xl">
                    Názov prípravku
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[70px] md:min-w-0 md:w-[8%]">
                    Auto kcal
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[75px] md:min-w-0 md:w-[8%]">
                    Auto proteín
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[85px] md:min-w-0 md:w-[9%]">
                    Rýchlosť (ml/h)
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[75px] md:min-w-0 md:w-[8%]">
                    Počet hodín
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-normal break-words min-w-[90px] md:min-w-0 md:w-[10%]">
                    ml (per specified hours)
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[50px] md:min-w-0 md:w-[7%]">
                    kcal
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-normal break-words min-w-[75px] md:min-w-0 md:w-[9%]">
                    Bielkoviny (g)
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[50px] md:min-w-0 md:w-[7%]">
                    Tuky (g)
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-1.5 sm:p-2 md:p-2.5 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[55px] md:min-w-0 md:w-[7%]">
                    Cukry (g)
                  </th>
                  <th className="bg-blue-600 dark:bg-blue-700 text-white font-semibold tracking-wide p-2 sm:p-2.5 md:p-3 text-center text-[10px] sm:text-xs md:text-sm whitespace-nowrap md:whitespace-normal break-words min-w-[72px] sm:min-w-[80px] md:min-w-0 md:w-[8%] last:rounded-tr-xl">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody>
                {preparations.map((prep, index) => (
                  <tr
                    key={index}
                    className={`group ${prep.autoKcal || prep.autoProtein ? "bg-green-50 dark:bg-gray-700" : ""} hover:bg-blue-50 dark:hover:bg-gray-700`}
                  >
                    <td
                      className={`p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[160px] sm:min-w-[180px] md:min-w-0 md:sticky md:left-0 md:z-20 md:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] md:dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] break-words group-hover:bg-blue-50 dark:group-hover:bg-gray-700 ${prep.autoKcal || prep.autoProtein ? "bg-green-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
                    >
                      <ProductDropdown
                        value={prep.name || ""}
                        onChange={(name) =>
                          handleFieldChange(index, "name", name)
                        }
                        isDarkMode={isDarkMode}
                      />
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[70px] md:min-w-0 break-words">
                      <input
                        type="checkbox"
                        checked={prep.autoKcal || false}
                        onChange={() => handleAutoCheck(index, "autoKcal")}
                        className="w-auto scale-110 sm:scale-125 cursor-pointer"
                        aria-label="Auto kcal"
                      />
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[75px] md:min-w-0 break-words">
                      <input
                        type="checkbox"
                        checked={prep.autoProtein || false}
                        onChange={() => handleAutoCheck(index, "autoProtein")}
                        className="w-auto scale-110 sm:scale-125 cursor-pointer"
                        aria-label="Auto proteín"
                      />
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[85px] md:min-w-0 break-words">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={prep.speed || ""}
                        onChange={(e) => {
                          // Prevent increase when either checkbox is checked
                          if (prep.autoKcal || prep.autoProtein) {
                            return; // Do nothing if checkbox is checked
                          }
                          handleFieldChange(
                            index,
                            "speed",
                            safeParseFloat(e.target.value, 0),
                          );
                        }}
                        disabled={prep.autoKcal || prep.autoProtein}
                        className={`w-full min-w-0 p-1.5 sm:p-2 md:p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-[10px] sm:text-xs md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 ${prep.autoKcal || prep.autoProtein ? "bg-green-50 dark:bg-gray-700 font-bold cursor-not-allowed opacity-60" : "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"}`}
                      />
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 min-w-[75px] md:min-w-0 break-words">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="24"
                        value={prep.hours}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "hours",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full min-w-0 p-1.5 sm:p-2 md:p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-[10px] sm:text-xs md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm min-w-0 break-words">
                      {prep.calculations?.ml || "0"}
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm min-w-0 break-words">
                      {prep.calculations?.kcal || "0"}
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm min-w-0 break-words">
                      {prep.calculations?.protein || "0"}
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm min-w-0 break-words">
                      {prep.calculations?.fat || "0"}
                    </td>
                    <td className="p-1 sm:p-1.5 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm min-w-0 break-words">
                      {prep.calculations?.carb || "0"}
                    </td>
                    <td className="p-2 sm:p-2.5 md:p-3 text-center border-b border-gray-200 dark:border-gray-600 min-w-[72px] sm:min-w-[80px] md:min-w-0 break-words align-middle">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center min-h-[32px] sm:min-h-[36px] bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl font-semibold shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm transition-all duration-200 whitespace-nowrap w-full max-w-full"
                        onClick={() => onRemoveRow(index)}
                      >
                        <span className="hidden sm:inline">Odstrániť</span>
                        <span className="sm:hidden text-lg leading-none">
                          ×
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 dark:bg-gray-700/90 font-bold text-xs sm:text-sm md:text-lg border-t-2 border-gray-200 dark:border-gray-600">
                  <td
                    colSpan="5"
                    className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 break-words"
                  >
                    Celkom
                  </td>
                  <td
                    id="total_ml"
                    className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm break-words ${getStatusClasses(totals?.mlClass || "")}`}
                  >
                    {totals?.ml || "0"}
                  </td>
                  <td
                    id="total_kcal"
                    className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm break-words ${getStatusClasses(totals?.kcalClass || "")}`}
                  >
                    {totals?.kcal || "0"}
                  </td>
                  <td
                    id="total_protein"
                    className={`p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm break-words ${getStatusClasses(totals?.proteinClass || "")}`}
                  >
                    {totals?.protein || "0"}
                  </td>
                  <td
                    id="total_fat"
                    className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm break-words"
                  >
                    {totals?.fat || "0"}
                  </td>
                  <td
                    id="total_carb"
                    className="p-1.5 sm:p-2 md:p-2.5 text-center border-b border-gray-200 dark:border-gray-600 text-[10px] sm:text-xs md:text-sm break-words"
                  >
                    {totals?.carb || "0"}
                  </td>
                  <td className="p-2 sm:p-2.5 md:p-3 text-center border-b border-gray-200 dark:border-gray-600"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 md:hidden">
          ← posuňte pre viac stĺpcov →
        </p>
      </div>
    </div>
  );
}

export default PreparationsTable;
