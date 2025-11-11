/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import artplayerPluginChapter from "./artPlayerPluinChaper";
import autoSkip from "./autoSkip";
import artplayerPluginVttThumbnail from "./artPlayerPluginVttThumbnail";
import {
  backward10Icon,
  backwardIcon,
  captionIcon,
  forward10Icon,
  forwardIcon,
  fullScreenOffIcon,
  fullScreenOnIcon,
  loadingIcon,
  logo,
  muteIcon,
  pauseIcon,
  pipIcon,
  playIcon,
  playIconLg,
  settingsIcon,
  volumeIcon,
} from "./PlayerIcons";
import "./Player.css";
import website_name from "@/src/config/website";
import getChapterStyles from "./getChapterStyle";
import { getLanguageCode } from "@/src/utils/languageCode";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import artplayerPluginUploadSubtitle from "./artplayerPluginUploadSubtitle";

Artplayer.LOG_VERSION = false;
Artplayer.CONTEXTMENU = false;

const KEY_CODES = {
  M: "KeyM",
  I: "KeyI",
  F: "KeyF",
  V: "KeyV",
  SPACE: "Space",
  SPACE_LEGACY: "Spacebar",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_RIGHT: "ArrowRight",
  ARROW_LEFT: "ArrowLeft",
};

// Detect Safari browser for native HLS support
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("android") &&
    !ua.includes("crios") &&
    !ua.includes("fxios")
  );
};

export default function Player({
  streamUrl,
  subtitles,
  thumbnail,
  intro,
  outro,
  autoSkipIntro,
  autoPlay,
  autoNext,
  episodeId,
  episodes,
  playNext,
  animeInfo,
  episodeNum,
  streamInfo,
}) {
  const artRef = useRef(null);
  const leftAtRef = useRef(0);
  const boundKeydownRef = useRef(null);
  const proxy = import.meta.env.VITE_PROXY_URL;
  const m3u8proxy = import.meta.env.VITE_M3U8_PROXY_URL?.split(",") || [];
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex((episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId)
  );

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  useEffect(() => {
    const applyChapterStyles = () => {
      const existingStyles = document.querySelectorAll("style[data-chapter-styles]");
      existingStyles.forEach((style) => style.remove());
      const styleElement = document.createElement("style");
      styleElement.setAttribute("data-chapter-styles", "true");
      const styles = getChapterStyles(intro, outro);
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
      return () => {
        styleElement.remove();
      };
    };

    if (streamUrl || intro || outro) {
      const cleanup = applyChapterStyles();
      return cleanup;
    }
  }, [streamUrl, intro, outro]);

  const playM3u8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;

      art.on("destroy", () => hls.destroy());

      video.addEventListener("timeupdate", () => {
        const currentTime = Math.round(video.currentTime);
        const duration = Math.round(video.duration);
        if (duration > 0 && currentTime >= duration) {
          art.pause();
          if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
            playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("timeupdate", () => {
        const currentTime = Math.round(video.currentTime);
        const duration = Math.round(video.duration);
        if (duration > 0 && currentTime >= duration) {
          art.pause();
          if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
            playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
          }
        }
      });
    } else {
      console.log("Unsupported playback format: m3u8");
    }
  };

  const createChapters = () => {
    const chapters = [];
    if (intro?.start !== 0 || intro?.end !== 0) {
      chapters.push({ start: intro.start, end: intro.end, title: "intro" });
    }
    if (outro?.start !== 0 || outro?.end !== 0) {
      chapters.push({ start: outro.start, end: outro.end, title: "outro" });
    }
    return chapters;
  };

  const isEditableElement = (el) => {
    if (!el) return false;
    const tagName = el.tagName?.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || el.isContentEditable) return true;
    if (el.closest) {
      const editable = el.closest("input, textarea, [contenteditable='true']");
      return !!editable;
    }
    return false;
  };

  const handleKeydown = (event, art) => {
    const container = artRef.current;
    if (!container || !art) return;

    const target = event.target;
    if (isEditableElement(target)) return;

    const eventIsInsidePlayer =
      container.contains(target) || container.contains(document.activeElement);

    if (!eventIsInsidePlayer) return;

    const code = event.code;

    switch (code) {
      case KEY_CODES.M:
        art.muted = !art.muted;
        break;
      case KEY_CODES.I:
        art.pip = !art.pip;
        break;
      case KEY_CODES.F: {
        event.preventDefault();
        event.stopPropagation();

        const container = artRef.current;
        const doc = document;
        const fsEl =
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement;

        if (fsEl && (fsEl === container || container.contains(fsEl))) {
          if (doc.exitFullscreen) doc.exitFullscreen();
          else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
          else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
          else if (doc.msExitFullscreen) doc.msExitFullscreen();
        } else {
          if (container.requestFullscreen) container.requestFullscreen();
          else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
          else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
          else if (container.msRequestFullscreen) container.msRequestFullscreen();
        }

        try {
          art.fullscreen = !art.fullscreen;
        } catch (e) {
          // ignore if art not available
        }
        break;
      }
      case KEY_CODES.V:
        event.preventDefault();
        event.stopPropagation();
        art.subtitle.show = !art.subtitle.show;
        break;
      case KEY_CODES.SPACE:
      case KEY_CODES.SPACE_LEGACY:
        event.preventDefault();
        event.stopPropagation();
        art.playing ? art.pause() : art.play();
        break;
      case KEY_CODES.ARROW_UP:
        event.preventDefault();
        event.stopPropagation();
        art.volume = Math.min(art.volume + 0.1, 1);
        break;
      case KEY_CODES.ARROW_DOWN:
        event.preventDefault();
        event.stopPropagation();
        art.volume = Math.max(art.volume - 0.1, 0);
        break;
      case KEY_CODES.ARROW_RIGHT:
        event.preventDefault();
        event.stopPropagation();
        art.currentTime = Math.min(art.currentTime + 10, art.duration);
        break;
      case KEY_CODES.ARROW_LEFT:
        event.preventDefault();
        event.stopPropagation();
        art.currentTime = Math.max(art.currentTime - 10, 0);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!streamUrl || !artRef.current) return;

    const iframeUrl = streamInfo?.streamingLink?.iframe;
    const headers = {
      referer: iframeUrl ? new URL(iframeUrl).origin + "/" : window.location.origin + "/",
    };

    const container = artRef.current;
    let fullscreenRefocusTimeout = null;

    try {
      if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "0");
      else {
        const current = parseInt(container.getAttribute("tabindex"), 10);
        if (isNaN(current) || current < 0) container.setAttribute("tabindex", "0");
      }
      container.style.outline = "none";
    } catch (e) {
      // ignore
    }

    // For Safari/iOS, try direct URL first to avoid proxy CORS issues with Apple TV
    const useSafariNativeHLS = isSafari();
    const videoUrl = useSafariNativeHLS
      ? streamUrl
      : m3u8proxy[Math.floor(Math.random() * m3u8proxy?.length)] +
        encodeURIComponent(streamUrl) +
        "&headers=" +
        encodeURIComponent(JSON.stringify(headers));

    const art = new Artplayer({
      url: videoUrl,
      container: artRef.current,
      type: "m3u8",
      autoplay: autoPlay,
      volume: 1,
      setting: true,
      playbackRate: true,
      pip: true,
      hotkey: false, 
      fullscreen: true,
      mutex: true,
      playsInline: true,
      lock: true,
      airplay: true,
      autoOrientation: true,
      fastForward: true,
      aspectRatio: true,
      moreVideoAttr: {
        crossOrigin: "anonymous",
        preload: "none",
        playsInline: true,
      },
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            setting: true,
            getName: (level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          },
        }),
        artplayerPluginUploadSubtitle(),
        artplayerPluginChapter({ chapters: createChapters() }),
      ],
      subtitle: {
        style: {
          color: "#fff",
          "font-weight": "400",
          left: "50%",
          transform: "translateX(-50%)",
          "margin-bottom": "2rem",
        },
        escape: false,
      },
      layers: [
        {
          name: website_name,
          html: logo,
          tooltip: website_name,
          style: {
            opacity: 1,
            position: "absolute",
            top: "5px",
            right: "5px",
            transition: "opacity 0.5s ease-out",
          },
        },
        {
          html: "",
          style: {
            position: "absolute",
            left: "50%",
            top: 0,
            width: "20%",
            height: "100%",
            transform: "translateX(-50%)",
          },
          disable: !Artplayer.utils.isMobile,
          click: () => art.toggle(),
        },
        {
          name: "rewind",
          html: "",
          style: { position: "absolute", left: 0, top: 0, width: "40%", height: "100%" },
          disable: !Artplayer.utils.isMobile,
          click: () => {
            art.controls.show = !art.controls.show;
          },
        },
        {
          name: "forward",
          html: "",
          style: { position: "absolute", right: 0, top: 0, width: "40%", height: "100%" },
          disable: !Artplayer.utils.isMobile,
          click: () => {
            art.controls.show = !art.controls.show;
          },
        },
        {
          name: "backwardIcon",
          html: backwardIcon,
          style: {
            position: "absolute",
            left: "25%",
            top: "50%",
            transform: "translate(50%,-50%)",
            opacity: 0,
            transition: "opacity 0.5s ease-in-out",
          },
          disable: !Artplayer.utils.isMobile,
        },
        {
          name: "forwardIcon",
          html: forwardIcon,
          style: {
            position: "absolute",
            right: "25%",
            top: "50%",
            transform: "translate(50%, -50%)",
            opacity: 0,
            transition: "opacity 0.5s ease-in-out",
          },
          disable: !Artplayer.utils.isMobile,
        },
      ],
      controls: [
        {
          html: backward10Icon,
          position: "right",
          tooltip: "Backward 10s",
          click: () => {
            art.currentTime = Math.max(art.currentTime - 10, 0);
          },
        },
        {
          html: forward10Icon,
          position: "right",
          tooltip: "Forward 10s",
          click: () => {
            art.currentTime = Math.min(art.currentTime + 10, art.duration);
          },
        },
      ],
      icons: {
        play: playIcon,
        pause: pauseIcon,
        setting: settingsIcon,
        volume: volumeIcon,
        pip: pipIcon,
        volumeClose: muteIcon,
        state: playIconLg,
        loading: loadingIcon,
        fullscreenOn: fullScreenOnIcon,
        fullscreenOff: fullScreenOffIcon,
      },
      customType: { m3u8: playM3u8 },
    });

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: (art.width > 500 ? art.width * 0.02 : art.width * 0.03) + "px",
      });
    });

    const refocusIfNeeded = (delay = 30) => {
      try {
        if (!container) return;
        const active = document.activeElement;
        if (!container.contains(active)) {
          fullscreenRefocusTimeout = setTimeout(() => {
            try {
              container.focus();
            } catch (e) {
              // ignore
            }
          }, delay);
        }
      } catch (e) {
        // ignore
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        refocusIfNeeded(40);
      } else {
        refocusIfNeeded(20);
      }
    };

    // vendor event wrappers
    const fullscreenEvents = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    fullscreenEvents.forEach((ev) => document.addEventListener(ev, onFullscreenChange));

    art.on("ready", () => {
      try {
        container.focus();
      } catch (e) {
        // ignore
      }

      const continueWatchingList = JSON.parse(localStorage.getItem("continueWatching")) || [];
      const currentEntry = continueWatchingList.find((item) => item.episodeId === episodeId);
      if (currentEntry?.leftAt) art.currentTime = currentEntry.leftAt;

      art.on("video:timeupdate", () => {
        leftAtRef.current = Math.floor(art.currentTime);
      });

      setTimeout(() => {
        art.layers[website_name].style.opacity = 0;
      }, 2000);

      const subs = (subtitles || []).map((s) => ({ ...s }));

      for (const sub of subs) {
        const encodedUrl = encodeURIComponent(sub.file);
        const encodedHeaders = encodeURIComponent(JSON.stringify(headers));
        sub.file = `${proxy}${encodedUrl}&headers=${encodedHeaders}`;
      }

      const defaultSubtitle = subs?.find((sub) => sub.label.toLowerCase() === "english");
      if (defaultSubtitle) {
        art.subtitle.switch(defaultSubtitle.file, {
          name: defaultSubtitle.label,
          default: true,
        });
      }

      // Add native HTML5 <track> elements for AirPlay subtitle support
      // AirPlay devices (Apple TV, etc.) only read native tracks, not custom renderers
      if (subs?.length > 0 && art.video) {
        const videoElement = art.video;

        // Remove any existing track elements first
        const existingTracks = videoElement.querySelectorAll("track");
        existingTracks.forEach((track) => track.remove());

        // Add native track elements for each subtitle
        subs.forEach((sub) => {
          const track = document.createElement("track");
          track.kind = "subtitles";
          track.label = sub.label;

          // Set language code based on label using iso-639-1
          track.srclang = getLanguageCode(sub.label);

          track.src = sub.file;

          // Set default track to English
          if (labelLower === "english") {
            track.default = true;
            track.mode = "showing";
          } else {
            track.mode = "hidden";
          }

          videoElement.appendChild(track);
        });

        // Store native tracks reference on art instance for later sync
        art.nativeTracks = Array.from(videoElement.textTracks);
      }

      // Add Media Session API for better AirPlay metadata
      if ("mediaSession" in navigator && animeInfo) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: episodeNum
              ? `${animeInfo.title} - Episode ${episodeNum}`
              : animeInfo.title,
            artist: animeInfo.japanese_title || animeInfo.title,
            artwork: animeInfo.poster
              ? [
                  {
                    src: animeInfo.poster,
                    sizes: "512x512",
                    type: "image/jpeg",
                  },
                ]
              : [],
          });
        } catch (err) {
          console.warn("Failed to set Media Session metadata:", err);
        }
      }

      const skipRanges = [
        ...(intro?.start != null && intro?.end != null ? [[intro.start + 1, intro.end - 1]] : []),
        ...(outro?.start != null && outro?.end != null ? [[outro.start + 1, outro.end]] : []),
      ];
      autoSkipIntro && art.plugins.add(autoSkip(skipRanges));

      const boundKeydown = (event) => handleKeydown(event, art);
      boundKeydownRef.current = boundKeydown;
      document.addEventListener("keydown", boundKeydown);

      const focusOnPointerDown = () => {
        try {
          container.focus();
        } catch (err) {
          // ignore
        }
      };
      container.addEventListener("pointerdown", focusOnPointerDown, { passive: true });

      const onWindowFocus = () => refocusIfNeeded(30);
      window.addEventListener("focus", onWindowFocus);

      art.on("destroy", () => {
        try {
          document.removeEventListener("keydown", boundKeydown);
        } catch (e) {}
        try {
          container.removeEventListener("pointerdown", focusOnPointerDown);
        } catch (e) {}
        try {
          window.removeEventListener("focus", onWindowFocus);
        } catch (e) {}
      });

      art.subtitle.style({
        fontSize: (art.width > 500 ? art.width * 0.02 : art.width * 0.03) + "px",
      });

      if (thumbnail) {
        art.plugins.add(
          artplayerPluginVttThumbnail({
            vtt: `${proxy}${thumbnail}`,
          })
        );
      }

      const $rewind = art.layers["rewind"];
      const $forward = art.layers["forward"];
      Artplayer.utils.isMobile &&
        art.proxy($rewind, "dblclick", () => {
          art.currentTime = Math.max(0, art.currentTime - 10);
          art.layers["backwardIcon"].style.opacity = 1;
          setTimeout(() => {
            art.layers["backwardIcon"].style.opacity = 0;
          }, 300);
        });
      Artplayer.utils.isMobile &&
        art.proxy($forward, "dblclick", () => {
          art.currentTime = Math.max(0, art.currentTime + 10);
          art.layers["forwardIcon"].style.opacity = 1;
          setTimeout(() => {
            art.layers["forwardIcon"].style.opacity = 0;
          }, 300);
        });

      if (subs?.length > 0) {
        const defaultEnglishSub =
          subs.find((sub) => sub.label.toLowerCase() === "english" && sub.default) ||
          subs.find((sub) => sub.label.toLowerCase() === "english");

        art.setting.add({
          name: "captions",
          icon: captionIcon,
          html: "Subtitle",
          tooltip: defaultEnglishSub?.label || "default",
          position: "right",
          selector: [
            {
              html: "Display",
              switch: true,
              onSwitch: (item) => {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;

                // Sync native tracks visibility for AirPlay
                if (art.nativeTracks && art.nativeTracks.length > 0) {
                  art.nativeTracks.forEach((track) => {
                    if (track.mode === "showing" && item.switch) {
                      track.mode = "hidden";
                    } else if (track.mode === "hidden" && !item.switch) {
                      // Only show the currently selected track
                      const currentSubLabel = art.subtitle.url
                        ? subs.find((s) => s.file === art.subtitle.url)?.label
                        : null;
                      if (currentSubLabel && track.label === currentSubLabel) {
                        track.mode = "showing";
                      }
                    }
                  });
                }

                return !item.switch;
              },
            },
            ...subs.map((sub) => ({
              default: sub.label.toLowerCase() === "english" && sub === defaultEnglishSub,
              html: sub.label,
              url: sub.file,
            })),
          ],
          onSelect: (item) => {
            art.subtitle.switch(item.url, { name: item.html });

            // Sync native tracks for AirPlay compatibility
            if (art.nativeTracks && art.nativeTracks.length > 0) {
              art.nativeTracks.forEach((track) => {
                if (track.label === item.html) {
                  track.mode = "showing";
                } else {
                  track.mode = "hidden";
                }
              });
            }

            return item.html;
          },
        });
      }
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }

      fullscreenEvents.forEach((ev) => document.removeEventListener(ev, onFullscreenChange));
      if (boundKeydownRef.current) {
        try {
          document.removeEventListener("keydown", boundKeydownRef.current);
        } catch (e) {}
        boundKeydownRef.current = null;
      }
      if (fullscreenRefocusTimeout) clearTimeout(fullscreenRefocusTimeout);

      try {
        const continueWatching = JSON.parse(localStorage.getItem("continueWatching")) || [];
        const newEntry = {
          id: animeInfo?.id,
          data_id: animeInfo?.data_id,
          episodeId,
          episodeNum,
          adultContent: animeInfo?.adultContent,
          poster: animeInfo?.poster,
          title: animeInfo?.title,
          japanese_title: animeInfo?.japanese_title,
          leftAt: leftAtRef.current,
          updatedAt: Date.now(),
        };

        if (!newEntry.data_id) return;

        const filtered = continueWatching.filter((item) => item.data_id !== newEntry.data_id);
        filtered.unshift(newEntry);
        localStorage.setItem("continueWatching", JSON.stringify(filtered));
      } catch (err) {
        console.error("Failed to save continueWatching:", err);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl, subtitles, intro, outro]);

  return <div ref={artRef} className="w-full h-full" />;
}
