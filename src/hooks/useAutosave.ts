import { useEffect, useState } from "react";

interface UseAutosaveOptions {
  key: string;
  delay?: number;
  initialValue?: string;
}

export function useAutosave({
  key,
  delay = 500,
  initialValue = "",
}: UseAutosaveOptions) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      setValue(saved);
    }
  }, [key]);

  // Save with debounce
  useEffect(() => {
    setIsSaving(true);

    const timeout = setTimeout(() => {
      localStorage.setItem(key, value);
      setIsSaving(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, key, delay]);

  return {
    value,
    setValue,
    isSaving,
  };
}
