import { useState, useEffect } from "react";

export default function useWatchControl() {
  const [autoPlay, setAutoPlay] = useState(
    () => JSON.parse(localStorage.getItem("autoPlay")) || false
  );
  const [autoSkipIntro, setAutoSkipIntro] = useState(
    () => JSON.parse(localStorage.getItem("autoSkipIntro")) || false
  );

  useEffect(() => {
    localStorage.setItem("autoPlay", JSON.stringify(autoPlay));
  }, [autoPlay]);

  useEffect(() => {
    localStorage.setItem("autoSkipIntro", JSON.stringify(autoSkipIntro));
  }, [autoSkipIntro]);

  return {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
  };
}
