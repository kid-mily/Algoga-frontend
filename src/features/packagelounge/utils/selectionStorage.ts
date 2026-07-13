import type { PackageSelection } from "../types";

const STORAGE_KEY = "algoga-package-selection";

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
