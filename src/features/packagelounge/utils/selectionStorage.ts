import type { PackageSelection } from "../types";

const STORAGE_KEY = "algoga-package-selection";

export function savePackageSelection(
  selection: Omit<PackageSelection, "selectedAt">
) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...selection,
      selectedAt: new Date().toISOString(),
    })
  );
}

export function getPackageSelection(): PackageSelection | null {
  if (typeof window === "undefined") return null;

  const storedValue = sessionStorage.getItem(STORAGE_KEY);
  if (!storedValue) return null;

  try {
    return JSON.parse(storedValue) as PackageSelection;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPackageSelection() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
