import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import website_name from "@/src/config/website";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Sidecard from "@/src/components/sidecard/Sidecard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";

function InfoItem({ label, value }) {
  return (
    value && (
      <p className="text-[14px] font-bold">
        {`${label}: `}
        <span className="font-light">{value}</span>
      </p>
    )
  );
}

function Tag({ bgColor, index, icon, text }) {
  return (
    <div
      className={`flex space-x-1 justify-center items-center px-[4px] py-[1px] text-black font-bold text-[13px] ${
        index === 0 ? "rounded-l-[4px]" : "rounded-none"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {icon && <FontAwesomeIcon icon={icon} className="text-[12px]" />}
      <p className="text-[12px]">{text}</p>
    </div>
  );
}

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const [isFull, setIsFull] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { homeInfo } = useHomeInfo();
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id === "404-not-found-page") {
      console.log("404 got!")
      return null;
    } else {
      const fetchAnimeInfo = async () => {
        setLoading(true);
        try {
          const data = await getAnimeInfo(id, random);
          setSeasons(data?.seasons);
          setAnimeInfo(data.data);
        } catch (err) {
          console.error("Error fetching anime info:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAnimeInfo();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, random]);
  useEffect(() => {
    if (animeInfo && location.pathname === `/${animeInfo.id}`) {
      document.title = `Watch ${animeInfo.title} English Sub/Dub online Free on ${website_name}`;
    }
    return () => {
      document.title = `${website_name} | Free anime streaming platform`;
    };
  }, [animeInfo]);
  if (loading) return <Loader type="animeInfo" />;
  if (error) {
    return <Error />;
  }
  if (!animeInfo) {
    navigate("/404-not-found-page");
    return undefined;
  }
  const { title, japanese_title, poster, animeInfo: info } = animeInfo;
  const tags = [
    {
      condition: info.tvInfo?.rating,
      bgColor: "#ffffff",
      text: info.tvInfo.rating,
    },
    {
      condition: info.tvInfo?.quality,
      bgColor: "#FFBADE",
      text: info.tvInfo.quality,
    },
    {
      condition: info.tvInfo?.sub,
      icon: faClosedCaptioning,
      bgColor: "#B0E3AF",
      text: info.tvInfo.sub,
    },
    {
      condition: info.tvInfo?.dub,
      icon: faMicrophone,
      bgColor: "#B9E7FF",
      text: info.tvInfo.dub,
    },
  ];

  return (
    <>
      <div className="relative grid grid-cols-[minmax(0,75%),minmax(0,25%)] h-fit w-full overflow-hidden text-white mt-[64px] max-[1200px]:flex max-[1200px]:flex-col max-md:mt-[50px]">
        <img
          src={poster}
          alt={`${title} Poster`}
          className="absolute inset-0 object-cover w-full h-full filter grayscale blur-lg z-[-900]"
        />
        <div className="flex items-start z-10 px-14 py-[70px] bg-[#252434] bg-opacity-70 gap-x-8 max-[1024px]:px-6 max-[1024px]:py-10 max-[1024px]:gap-x-4 max-[575px]:flex-col max-[575px]:items-center max-[575px]:justify-center">
          <div className="relative w-[180px] h-[270px] max-[575px]:w-[140px] max-[575px]:h-[200px] flex-shrink-0">
            <img
              src={poster}
              alt={`${title} Poster`}
              className="w-full h-full object-cover object-center flex-shrink-0"
            />
            {animeInfo.adultContent && (
              <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                18+
              </div>
            )}
          </div>
          <div className="flex flex-col ml-4 gap-y-5 max-[575px]:items-center max-[575px]:justify-center max-[575px]:mt-6 max-[1200px]:ml-0">
            <ul className="flex gap-x-2 items-center w-fit max-[1200px]:hidden">
              {[
                ["Home", ""],
                [info.tvInfo?.showType, info.tvInfo?.showType],
              ].map(([text, link], index) => (
                <li key={index} className="flex gap-x-3 items-center">
                  <Link
                    to={`/${link}`}
                    className="text-white hover:text-[#FFBADE] text-[15px] font-semibold"
                  >
                    {text}
                  </Link>
                  <div className="dot mt-[1px] bg-white"></div>
                </li>
              ))}
              <p className="font-light text-[15px] text-gray-300 line-clamp-1 max-[575px]:leading-5">
                {language === "EN" ? title : japanese_title}
              </p>
            </ul>
            <h1 className="text-4xl font-semibold max-[1200px]:text-3xl max-[575px]:text-2xl max-[575px]:text-center  max-[575px]:leading-7">
              {language === "EN" ? title : japanese_title}
            </h1>
            <div className="flex flex-wrap w-fit gap-x-[2px] mt-3 max-[575px]:mx-auto max-[575px]:mt-0 gap-y-[3px] max-[320px]:justify-center">
              {tags.map(
                ({ condition, icon, bgColor, text }, index) =>
                  condition && (
                    <Tag
                      key={index}
                      index={index}
                      bgColor={bgColor}
                      icon={icon}
                      text={text}
                    />
                  )
              )}
              <div className="flex w-fit items-center ml-1">
                {[info.tvInfo?.showType, info.tvInfo?.duration].map(
                  (item, index) =>
                    item && (
                      <div
                        key={index}
                        className="px-1 h-fit flex items-center gap-x-2 w-fit"
                      >
                        <div className="dot mt-[2px]"></div>
                        <p className="text-[14px]">{item}</p>
                      </div>
                    )
                )}
              </div>
            </div>
            <Link
              to={`/watch/${animeInfo.id}`}
              className="flex gap-x-2 px-6 py-2 bg-[#FFBADE] w-fit text-black items-center rounded-3xl mt-5"
            >
              <FontAwesomeIcon icon={faPlay} className="text-[14px] mt-[1px]" />
              <p className="text-lg font-medium">Watch Now</p>
            </Link>
            {info?.Overview && (
              <div className="text-[14px] mt-2 max-[575px]:hidden">
                {info.Overview.length > 270 ? (
                  <>
                    {isFull
                      ? info.Overview
                      : `${info.Overview.slice(0, 270)}...`}
                    <span
                      className="text-[13px] font-bold hover:cursor-pointer"
                      onClick={() => setIsFull(!isFull)}
                    >
                      {isFull ? "- Less" : "+ More"}
                    </span>
                  </>
                ) : (
                  info.Overview
                )}
              </div>
            )}
            <p className="text-[14px] max-[575px]:hidden">
              {`${website_name} is the best site to watch `}
              <span className="font-bold">{title}</span>
              {` SUB online, or you can even watch `}
              <span className="font-bold">{title}</span>
              {` DUB in HD quality.`}
            </p>
            <div className="flex gap-x-4 items-center mt-4 max-[575px]:w-full max-[575px]:justify-center max-[320px]:hidden">
              <img
                src="https://s11.gifyu.com/images/SBdmo.gif"
                alt="Share Anime"
                className="w-[60px] h-auto rounded-full max-[1024px]:w-[40px]"
              />
              <div className="flex flex-col w-fit">
                <p className="text-[15px] font-bold text-[#FFBADE]">
                  Share Anime
                </p>
                <p className="text-[16px] text-white">to your friends</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#4c4b57c3] flex items-center px-8 max-[1200px]:py-10 max-[1200px]:bg-[#363544e0] max-[575px]:p-4">
          <div className="w-full flex flex-col h-fit gap-y-3">
            {info?.Overview && (
              <div className="custom-xl:hidden max-h-[150px] overflow-hidden">
                <p className="text-[13px] font-bold">Overview:</p>
                <div className="max-h-[110px] mt-2 overflow-y-scroll">
                  <p className="text-[14px] font-light">{info.Overview}</p>
                </div>
              </div>
            )}
            {[
              { label: "Japanese", value: info?.Japanese },
              { label: "Synonyms", value: info?.Synonyms },
              { label: "Aired", value: info?.Aired },
              { label: "Premiered", value: info?.Premiered },
              { label: "Duration", value: info?.Duration },
              { label: "Status", value: info?.Status },
              { label: "MAL Score", value: info?.["MAL Score"] },
            ].map(({ label, value }, index) => (
              <InfoItem key={index} label={label} value={value} />
            ))}
            {info?.Genres && (
              <div className="flex gap-x-2 py-2 custom-xl:border-t custom-xl:border-b custom-xl:border-white/20 max-[1200px]:border-none">
                <p>Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {info.Genres.map((genre, index) => (
                    <Link
                      to={`/genre/${genre.split(" ").join("-")}`}
                      key={index}
                      className="text-[14px] font-semibold px-2 py-[1px] border border-gray-400 rounded-2xl hover:text-[#ffbade]"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {[
              { label: "Studios", value: info?.Studios },
              { label: "Producers", value: info?.Producers },
            ].map(({ label, value }, index) => (
              <InfoItem
                key={index}
                label={label}
                value={Array.isArray(value) ? value.join(", ") : value}
              />
            ))}
            <p className="text-[14px] mt-4 custom-xl:hidden">
              {`${website_name} is the best site to watch `}
              <span className="font-bold">{title}</span>
              {` SUB online, or you can even watch `}
              <span className="font-bold">{title}</span>
              {` DUB in HD quality.`}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex flex-col">
        <div>
          {seasons.length > 0 && (
            <div className="flex flex-col gap-y-7 mt-8">
              <h1 className="w-fit text-2xl text-[#ffbade] max-[478px]:text-[18px] font-bold">
                More Seasons
              </h1>
              <div className="flex flex-wrap gap-4 max-[575px]:grid max-[575px]:grid-cols-3 max-[575px]:gap-3 max-[480px]:grid-cols-2">
                {seasons.map((season, index) => (
                  <Link
                    to={`/${season.id}`}
                    key={index}
                    className={`relative w-[20%] h-[60px] rounded-lg overflow-hidden cursor-pointer group ${
                      currentId === String(season.id)
                        ? "border border-[#ffbade]"
                        : ""
                    } max-[1200px]:w-[140px] max-[575px]:w-full`}
                  >
                    <p
                      className={`text-[13px] text-center font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-2 z-30 line-clamp-2 group-hover:text-[#ffbade] ${
                        currentId === String(season.id)
                          ? "text-[#ffbade]"
                          : "text-white"
                      }`}
                    >
                      {season.season}
                    </p>
                    <div className="absolute inset-0 z-10 bg-[url('https://i.ibb.co/25B65jX/thumb.png')] bg-repeat"></div>
                    <img
                      src={season.season_poster}
                      alt=""
                      className="w-full h-full object-cover blur-[3px] opacity-50"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {animeInfo?.charactersVoiceActors.length > 0 && (
            <Voiceactor animeInfo={animeInfo} />
          )}
          {animeInfo.recommended_data.length > 0 && (
            <CategoryCard
              label="Recommended for you"
              data={animeInfo.recommended_data}
              limit={animeInfo.recommended_data.length}
              showViewMore={false}
              className={"mt-8"}
            />
          )}
        </div>
        <div>
          {animeInfo.related_data.length > 0 && (
            <Sidecard
              label="Related Anime"
              data={animeInfo.related_data}
              className="mt-8"
            />
          )}
          {homeInfo && homeInfo.most_popular && (
            <Sidecard
              label="Most Popular"
              data={homeInfo.most_popular.slice(0, 10)}
              className="mt-[40px]"
              limit={10}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AnimeInfo;
