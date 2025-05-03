import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import getQtip from "@/src/utils/getQtip.utils";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStar,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Qtip({ id }) {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQtipInfo = async () => {
      setLoading(true);
      try {
        const data = await getQtip(id);
        setQtip(data);
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQtipInfo();
  }, [id]);

  return (
    <div className="w-[320px] h-fit rounded-xl p-4 flex justify-center items-center bg-[#3e3c50] bg-opacity-70 backdrop-blur-[10px] z-50">
      {loading || error || !qtip ? (
        <BouncingLoader />
      ) : (
        <div className="w-full flex flex-col justify-start gap-y-2">
          <h1 className="text-xl font-semibold text-white text-[13px] leading-6">
            {qtip.title}
          </h1>
          <div className="w-full flex items-center relative mt-2">
            {qtip?.rating && (
              <div className="flex gap-x-2 items-center">
                <FontAwesomeIcon icon={faStar} className="text-[#ffc107]" />
                <p className="text-[#b7b7b8]">{qtip.rating}</p>
              </div>
            )}
            <div className="flex ml-4 gap-x-[1px] overflow-hidden rounded-md items-center h-fit">
              {qtip?.quality && (
                <div className="bg-[#ffbade] px-[7px] w-fit flex justify-center items-center py-[1px] text-black">
                  <p className="text-[12px] font-semibold">{qtip.quality}</p>
                </div>
              )}
              <div className="flex gap-x-[1px] w-fit items-center py-[1px]">
                {qtip?.subCount && (
                  <div className="flex gap-x-1 justify-center items-center bg-[#B0E3AF] px-[7px] text-black">
                    <FontAwesomeIcon
                      icon={faClosedCaptioning}
                      className="text-[13px]"
                    />
                    <p className="text-[13px] font-semibold">{qtip.subCount}</p>
                  </div>
                )}
                {qtip?.dubCount && (
                  <div className="flex gap-x-1 justify-center items-center bg-[#B9E7FF] px-[7px] text-black">
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      className="text-[13px]"
                    />
                    <p className="text-[13px] font-semibold">{qtip.dubCount}</p>
                  </div>
                )}
                {qtip?.episodeCount && (
                  <div className="flex gap-x-1 justify-center items-center bg-[#a199a3] px-[7px] text-black">
                    <p className="text-[13px] font-semibold">
                      {qtip.episodeCount}
                    </p>
                  </div>
                )}
              </div>
              {qtip?.type && (
                <div className="absolute right-0 top-0 justify-center items-center rounded-sm bg-[#ffbade] px-[6px] text-black">
                  <p className="font-semibold text-[13px]">{qtip.type}</p>
                </div>
              )}
            </div>
          </div>
          {qtip?.description && (
            <p className="text-[#d7d7d8] text-[13px] leading-4 font-light line-clamp-3 mt-1">
              {qtip.description}
            </p>
          )}
          <div className="flex flex-col mt-1">
            {qtip?.japaneseTitle && (
              <div className="leading-4">
                <span className="text-[#b7b7b8] text-[13px]">
                  Japanese:&nbsp;
                </span>
                <span className="text-[13px]">{qtip.japaneseTitle}</span>
              </div>
            )}
            {qtip?.Synonyms && (
              <div className="leading-4">
                <span className="text-[#b7b7b8] text-[13px]">
                  Synonyms:&nbsp;
                </span>
                <span className="text-[13px]">{qtip.Synonyms}</span>
              </div>
            )}
            {qtip?.airedDate && (
              <div className="leading-4">
                <span className="text-[#b7b7b8] text-[13px]">Aired:&nbsp;</span>
                <span className="text-[13px]">{qtip.airedDate}</span>
              </div>
            )}
            {qtip?.status && (
              <div className="leading-4">
                <span className="text-[#b7b7b8] text-[13px]">
                  Status:&nbsp;
                </span>
                <span className="text-[13px]">{qtip.status}</span>
              </div>
            )}
            {qtip?.genres && (
              <div className="leading-4 flex flex-wrap text-wrap">
                <span className="text-[#b7b7b8] text-[13px]">
                  Genres:&nbsp;
                </span>
                {qtip.genres.map((genre, index) => (
                  <Link
                    to={`/genre/${genre}`}
                    key={index}
                    className="text-[13px] hover:text-[#ffbade]"
                  >
                    <span>
                      {genre}
                      {index === qtip.genres.length - 1 ? "" : ","}&nbsp;
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to={qtip.watchLink}
            className="w-[80%] flex mt-4 justify-center items-center gap-x-2 bg-[#ffbade] py-[9px] rounded-3xl"
          >
            <FontAwesomeIcon icon={faPlay} className="text-[14px] text-black" />
            <p className="text-[14px] font-semibold text-black">Watch Now</p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Qtip;
