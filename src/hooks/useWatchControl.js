import { useState, useEffect } from "react";

export default function useWatchControl() {
  const [autoPlay, setAutoPlay] = useState(
    () => JSON.parse(localStorage.getItem("autoPlay")) || false
  );
  const [autoSkipIntro, setAutoSkipIntro] = useState(
    () => JSON.parse(localStorage.getItem("autoSkipIntro")) || false
  );
  const [autoNext, setAutoNext] = useState(
    () => JSON.parse(localStorage.getItem("autoNext")) || false
  );

  useEffect(() => {
    localStorage.setItem("autoPlay", JSON.stringify(autoPlay));
  }, [autoPlay]);

  useEffect(() => {
    localStorage.setItem("autoSkipIntro", JSON.stringify(autoSkipIntro));
  }, [autoSkipIntro]);

  useEffect(() => {
    localStorage.setItem("autoNext", JSON.stringify(autoNext));
  }, [autoNext]);

  return {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
    autoNext,
    setAutoNext,
  };
}
