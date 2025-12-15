import { useEffect, useState } from "react";
import { LocalStorageIdEnum } from "../enum/utility.enum";
export type SetValue<T> = T | ((val: T) => T);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useLocalStorage<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: LocalStorageIdEnum | any,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  // Pass  initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;

export function getIsClient() {
  return typeof window !== "undefined";
}

export function getLocalStorageData<T>(
  key: LocalStorageIdEnum,
  initialValue: T
): T {
  if (getIsClient()) {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
    return storedValue ? JSON.parse(storedValue) : initialValue;
  }

  return initialValue;
}

export function setLocalStorageData<T>(key: LocalStorageIdEnum, data: T) {
  if (getIsClient()) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
