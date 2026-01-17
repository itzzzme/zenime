import { createContext, useContext, useState, useEffect } from "react";
import getHomeInfo from "../utils/getHomeInfo.utils.js";

const CACHE_KEY = "homeInfoCache";
const HomeInfoContext = createContext();

const isValidHomeInfo = (data) => {
  if (!data || typeof data !== "object") return false;

  return Object.values(data).some(
    (value) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "object" && value !== null && Object.keys(value).length > 0)
  );
};

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      return isValidHomeInfo(parsed?.data) ? parsed.data : null;
    } catch {
      return null;
    }
  });

  const [homeInfoLoading, setHomeInfoLoading] = useState(() => !homeInfo);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHomeInfo = async () => {
      setHomeInfoLoading(true);

      try {
        const data = await getHomeInfo();

        if (cancelled) return;

        if (isValidHomeInfo(data)) {
          setHomeInfo(data);
          setError(null);
        } else {
          setError(new Error("Invalid or empty home data"));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching home info:", err);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setHomeInfoLoading(false);
        }
      }
    };

    fetchHomeInfo();

    const onStorage = (e) => {
      if (e.key !== CACHE_KEY) return;

      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null;

        if (isValidHomeInfo(parsed?.data)) {
          setHomeInfo(parsed.data);
          setError(null);
        } else {
          setHomeInfo(null);
        }
      } catch {
        setHomeInfo(null);
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <HomeInfoContext.Provider
      value={{ homeInfo, homeInfoLoading, error }}
    >
      {children}
    </HomeInfoContext.Provider>
  );
};

export const useHomeInfo = () => useContext(HomeInfoContext);
