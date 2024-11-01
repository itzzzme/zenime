import { useState, useEffect } from "react";
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getStreamInfo from "@/src/utils/getStreamInfo.utils";
import getEpisodes from "@/src/utils/getEpisodes.utils";
import getNextEpisodeSchedule from "../utils/getNextEpisodeSchedule.utils";

export const useWatch = (animeId, initialEpisodeId) => {
  const [error, setError] = useState(null);
  const [buffering, setBuffering] = useState(true);
  const [streamInfo, setStreamInfo] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [animeInfoLoading, setAnimeInfoLoading] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [servers, setServers] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isFullOverview, setIsFullOverview] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [intro, setIntro] = useState(null);
  const [outro, setOutro] = useState(null);
  const [episodeId, setEpisodeId] = useState(initialEpisodeId);
  const [activeEpisodeNum, setActiveEpisodeNum] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);

  useEffect(() => {
    const fetchNextEpisodeSchedule = async (animeId) => {
      try {
        const data = await getNextEpisodeSchedule(animeId);
        setNextEpisodeSchedule(data);
      } catch (err) {
        console.error("Error fetching next episode schedule:", err);
      }
    };
    fetchNextEpisodeSchedule(animeId);
  }, [animeId]);

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      setAnimeInfoLoading(true);
      try {
        const data = await getAnimeInfo(animeId, false);
        setAnimeInfo(data?.data);
        setSeasons(data?.seasons);
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setAnimeInfoLoading(false);
      }
    };
    fetchAnimeInfo();
  }, [animeId]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEpisodes(animeId);
        setEpisodes(data?.episodes);
        setTotalEpisodes(data?.totalEpisodes);
      } catch (err) {
        console.error("Error fetching episodes:", err);
        setError(err.message || "An error occurred.");
      }
    })();
  }, [animeId]);

  useEffect(() => {
    if (!episodes || !episodeId) {
      setActiveEpisodeNum(null);
      return;
    }
    const activeEpisode = episodes.find((episode) => {
      const match = episode.id.match(/ep=(\d+)/);
      return match && match[1] === episodeId;
    });

    const newActiveEpisodeNum = activeEpisode ? activeEpisode.episode_no : null;

    if (activeEpisodeNum !== newActiveEpisodeNum) {
      setActiveEpisodeNum(newActiveEpisodeNum);
    }
  }, [episodeId, episodes, activeEpisodeNum]);

  useEffect(() => {
    if (!episodeId || isNaN(Number(episodeId))) {
      setError(
        "Invalid episode ID format. Please provide a valid episode number."
      );
      return;
    }

    const fetchStreamInfo = async () => {
      setBuffering(true);
      setServerLoading(true); // Start loading servers
      try {
        const data = await getStreamInfo(`${animeId}?ep=${episodeId}`);
        const streamData = data?.streamingLink.filter(
          (server) =>
            (server?.type === "sub" &&
              (server?.server === "HD-1" || server?.server === "HD-2")) ||
            (server?.type === "dub" &&
              (server?.server === "HD-1" || server?.server === "HD-2"))
        );
        const initialServer =
          streamData.find(
            (server) => server?.type === "sub" && server?.server === "HD-1"
          ) ||
          streamData.find(
            (server) => server?.type === "sub" && server?.server === "HD-2"
          ) ||
          streamData.find(
            (server) => server?.type === "dub" && server?.server === "HD-1"
          ) ||
          streamData.find(
            (server) => server?.type === "dub" && server?.server === "HD-2"
          );
        setActiveServerId(initialServer?.id);
        setServers(
          data?.servers.filter(
            (server) =>
              server.serverName === "HD-1" || server.serverName === "HD-2"
          )
        );
        setStreamInfo(streamData);
      } catch (err) {
        console.error("Error fetching stream info:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setBuffering(false);
        setServerLoading(false);
      }
    };
    fetchStreamInfo();
  }, [animeId, episodeId]);

  useEffect(() => {
    if (!streamInfo) return;
    const { link, intro, outro, tracks } =
      streamInfo?.find((file) => file.id === activeServerId) || {};
    setStreamUrl(link?.file || null);
    setIntro(intro);
    setOutro(outro);
    const subtitles =
      tracks
        ?.filter((track) => track.kind === "captions")
        .map(({ file, label }) => ({ file, label })) || [];
    setSubtitles(subtitles);
    const thumbnailTrack = tracks?.find(
      (track) => track.kind === "thumbnails" && track.file
    );
    if (thumbnailTrack) setThumbnail(thumbnailTrack.file);
  }, [streamInfo, activeServerId]);

  return {
    error,
    buffering,
    serverLoading,
    streamInfo,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    animeInfoLoading,
    totalEpisodes,
    seasons,
    servers,
    streamUrl,
    isFullOverview,
    setIsFullOverview,
    subtitles,
    thumbnail,
    intro,
    outro,
    episodeId,
    setEpisodeId,
    activeEpisodeNum,
    setActiveEpisodeNum,
    activeServerId,
    setActiveServerId,
  };
};
