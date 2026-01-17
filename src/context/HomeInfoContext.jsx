import { createContext, useContext, useState, useEffect } from "react";
import getHomeInfo from "../utils/getHomeInfo.utils.js";

const CACHE_KEY = "homeInfoCache";
const HomeInfoContext = createContext();

const isValidHomeInfo = (data) =>
  data && typeof data === "object" && Object.keys(data).length > 0;

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);
      return isValidHomeInfo(parsed?.data) ? parsed.data : null;
    } catch {
      return null;
    }
  });

  const [homeInfoLoading, setHomeInfoLoading] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return true;

    try {
      const parsed = JSON.parse(cached);
      return !isValidHomeInfo(parsed?.data);
    } catch {
      return true;
    }
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHomeInfo = async () => {
      if (!isValidHomeInfo(homeInfo)) {
        setHomeInfoLoading(true);
      }

      try {
        const data = await getHomeInfo();

        if (cancelled) return;

        if (isValidHomeInfo(data)) {
          setHomeInfo(data);
          setError(null);
        } else {
          setHomeInfo(null);
          setError(new Error("No results found"));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching home info:", err);
          setError(err);
          setHomeInfo(null);
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
        setHomeInfo(isValidHomeInfo(parsed?.data) ? parsed.data : null);
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
