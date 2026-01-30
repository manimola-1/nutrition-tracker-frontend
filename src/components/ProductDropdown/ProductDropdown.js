import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { nutritionProducts } from "../../data/nutritionProducts";

const FIXED = ["Propofol 1%", "Propofol 2%"];
const GROUPS = ["Parenteral", "Enteral"];
const LS_KEY = "favoriteNutritionProducts";

export default function ProductDropdown({ value, onChange }) {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [pos, setPos] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(LS_KEY) || "[]"),
  );

  /* ---------- open dropdown ---------- */
  const showDropdown = () => {
    const rect = inputRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setOpen(true);
  };

  /* ---------- close on outside click ---------- */
  useEffect(() => {
    if (!open) return;

    const close = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  /* ---------- favorites ---------- */
  const toggleFavorite = (name, e) => {
    e.stopPropagation();
    const updated = favorites.includes(name)
      ? favorites.filter((f) => f !== name)
      : [...favorites, name];

    setFavorites(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  /* ---------- select ---------- */
  const selectItem = (name) => {
    onChange(name);
    setOpen(false);
    setFilter("");
  };

  /* ---------- filtering logic (same as JS) ---------- */
  const lower = filter.toLowerCase();
  const all = nutritionProducts.map((p) => ({ name: p.name, type: p.type }));

  const matchingFixed = FIXED.filter((n) => n.toLowerCase().includes(lower));
  const matchingFavorites = favorites
    .filter((n) => n.toLowerCase().includes(lower))
    .sort((a, b) => a.localeCompare(b));

  const getGroupItems = (group) =>
    all
      .filter(
        (p) =>
          p.type === group &&
          !favorites.includes(p.name) &&
          !FIXED.includes(p.name) &&
          p.name.toLowerCase().includes(lower),
      )
      .map((p) => p.name)
      .sort((a, b) => a.localeCompare(b));

  /* ---------- dropdown UI ---------- */
  const dropdown = open && pos && (
    <div
      ref={dropdownRef}
      style={pos}
      className="absolute z-[9999] bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-lg dark:shadow-gray-900/50 max-h-80 overflow-y-auto [&_hr]:border-gray-200 dark:[&_hr]:border-gray-700"
    >
      <input
        autoFocus
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Hľadať..."
        className="w-full px-2 py-1 border-b border-gray-200 dark:border-gray-700 dark:bg-black dark:text-gray-100 outline-none placeholder-gray-500 dark:placeholder-gray-400"
      />

      <div>
        {matchingFixed.map((name) => (
          <Item key={name} name={name} onSelect={selectItem} />
        ))}

        {matchingFavorites.length > 0 && (
          <>
            <hr />
            <Header text="Obľúbené" />
            {matchingFavorites.map((name) => (
              <Item
                key={name}
                name={name}
                onSelect={selectItem}
                fav
                onStar={toggleFavorite}
              />
            ))}
          </>
        )}

        {GROUPS.map((group) => {
          const items = getGroupItems(group);
          if (!items.length) return null;
          return (
            <React.Fragment key={group}>
              <hr />
              <Header text={group} />
              {items.map((name) => (
                <Item
                  key={name}
                  name={name}
                  onSelect={selectItem}
                  fav={favorites.includes(name)}
                  onStar={toggleFavorite}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full relative">
      <input
        ref={inputRef}
        value={value || ""}
        readOnly
        onClick={showDropdown}
        placeholder="Vyberte prípravok"
        className="w-full min-w-0 max-w-full box-border border border-gray-300 dark:border-gray-600 pl-2 sm:pl-3 pr-8 py-1.5 sm:py-2 rounded-md cursor-pointer bg-inherit dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-xs sm:text-sm truncate"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      {createPortal(dropdown, document.body)}
    </div>
  );
}

/* ---------- small components ---------- */

function Header({ text }) {
  return (
    <div className="px-2 py-1 font-bold bg-gray-100 dark:bg-gray-800 dark:text-gray-200 sticky top-0">
      {text}
    </div>
  );
}

function Item({ name, onSelect, fav, onStar }) {
  return (
    <div
      onClick={() => onSelect(name)}
      className="flex justify-between px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 dark:text-gray-100"
    >
      <span>{name}</span>
      {onStar && (
        <span onClick={(e) => onStar(name, e)}>{fav ? "★" : "☆"}</span>
      )}
    </div>
  );
}
