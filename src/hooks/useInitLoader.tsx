import { useState, useEffect } from "react";

export default function useInitLoader(timeoutDuration: number) {
  const [initLoader, setInitLoader] = useState(true);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setInitLoader(false);
    }, timeoutDuration);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [timeoutDuration]);

  return initLoader;
}
