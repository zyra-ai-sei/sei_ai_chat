import { useEffect, useState } from "react";
import { SessionStorageIdEnum } from "../enum/utility.enum";
export type SetValue<T> = T | ((val: T) => T);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useSessionStorage<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: SessionStorageIdEnum | any,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  // Pass  initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
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
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useSessionStorage;

export function getIsClient() {
  return typeof window !== "undefined";
}

export function getSessionStorageData<T>(
  key: SessionStorageIdEnum,
  initialValue: T
): T {
  if (getIsClient()) {
    const storedValue = window.sessionStorage.getItem(key);
    if (!storedValue) {
      sessionStorage.setItem(key, JSON.stringify(initialValue));
    }
    return storedValue ? JSON.parse(storedValue) : initialValue;
  }

  return initialValue;
}

export function setSessionStorageData<T>(key: SessionStorageIdEnum, data: T) {
  if (getIsClient()) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
}
