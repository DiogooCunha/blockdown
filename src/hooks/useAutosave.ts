import { useEffect, useState } from "react";

interface UseAutosaveOptions {
  noteID: string;
  key: string;
  delay?: number;
  content?: string;
}

export function useAutosave({
  noteID,
  key,
  delay = 500,
  content = "",
}: UseAutosaveOptions) {
  const storageKey = `${noteID}:${key}`;
  const [value, setValue] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setValue(saved);
    }
  }, [storageKey]);

  // Save with debounce
  useEffect(() => {
    if (value === content) return;

    setIsSaving(true);

    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, value);
      setIsSaving(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, storageKey, delay]);

  return {
    value,
    setValue,
    isSaving,
  };
}
