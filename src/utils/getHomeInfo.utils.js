import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;
  const currentTime = Date.now();

  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw);

      const isValidCache =
        cachedData?.data &&
        Object.keys(cachedData.data).length > 0 &&
        currentTime - cachedData.timestamp < CACHE_DURATION;

      if (isValidCache) {
        return cachedData.data;
      }
    }
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }

  const response = await axios.get(api_url);
  const results = response?.data?.results;

  if (!results || typeof results !== "object") {
    return null;
  }

  const {
    spotlights = [],
    trending = [],
    topTen: topten = [],
    today: todaySchedule = [],
    topAiring: top_airing = [],
    mostPopular: most_popular = [],
    mostFavorite: most_favorite = [],
    latestCompleted: latest_completed = [],
    latestEpisode: latest_episode = [],
    topUpcoming: top_upcoming = [],
    recentlyAdded: recently_added = [],
    genres = [],
  } = results;

  const finalData = {
    spotlights,
    trending,
    topten,
    todaySchedule,
    top_airing,
    most_popular,
    most_favorite,
    latest_completed,
    latest_episode,
    top_upcoming,
    recently_added,
    genres,
  };

  if (Object.keys(finalData).length === 0) {
    return null;
  }

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: finalData,
      timestamp: currentTime,
    })
  );

  return finalData;
}
