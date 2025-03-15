import { useState, useEffect } from "react";

/**
 * This hook fix hydration when use persist to save hook data to localStorage
 */
export const useStore = <T, S>(store: (callback: (state: S) => void) => T, callback: (state: S) => any): T | undefined => {
  const result = store(callback);
  const [data, setData] = useState<T>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
