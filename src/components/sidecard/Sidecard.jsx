import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";

function Sidecard({ data, label, className, limit }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const handleMouseEnter = (item) => {
    const timeout = setTimeout(() => {
      setHoveredItem(item.id);
    }, 400);
    setHoverTimeout(timeout);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredItem(null);
  };
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const displayedData = limit
    ? data.slice(0, limit)
    : showAll
    ? data
    : data.slice(0, 6);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, data);
  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <h1 className="font-bold text-2xl text-[#ffbade]">{label}</h1>
      <div className="flex flex-col space-y-4 bg-[#2B2A3C] p-4 pt-8">
        {data &&
          displayedData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-x-4"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <div
                style={{
                  borderBottom:
                    index + 1 < displayedData.length
                      ? "1px solid rgba(255, 255, 255, .075)"
                      : "none",
                }}
                className="flex pb-4 relative container items-center"
              >
                {hoveredItem === item.id && window.innerWidth > 1024 && (
                  <div
                    className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} ${
                      tooltipPosition === "top-1/2"
                        ? "translate-y-[50px]"
                        : "translate-y-[-50px]"
                    } z-[100000] transform transition-all duration-300 ease-in-out ${
                      hoveredItem === item.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    <Qtip id={item.id} />
                  </div>
                )}
                <img
                  src={item.poster}
                  alt={item.title}
                  className="flex-shrink-0 w-[60px] h-[75px] rounded-md object-cover"
                  loading="lazy"
                  onClick={() => navigate(`/watch/${item.id}`)}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                />
                <div className="flex flex-col ml-4 space-y-2">
                  <Link
                    to={`/${item.id}`}
                    className="text-[1em] font-[500] hover:cursor-pointer hover:text-[#ffbade] transform transition-all ease-out line-clamp-1 max-[478px]:line-clamp-2 max-[478px]:text-[14px]"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </Link>
                  <div className="flex flex-wrap items-center w-fit space-x-1 max-[320px]:gap-y-2">
                    {item.tvInfo?.sub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[4px] px-[4px] text-black py-[2px]">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.sub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.dub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[4px] px-[8px] text-black py-[2px]">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.showType && (
                      <div className="flex items-center gap-x-2">
                        <div className="dot ml-[4px]"></div>
                        <p className="text-[15px] font-light">
                          {item.tvInfo.showType}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!limit && data.length > 6 && (
          <button
            className="w-full bg-[#555462d3] py-3 mt-4 hover:bg-[#555462] rounded-md font-bold transform transition-all ease-out"
            onClick={toggleShowAll}
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidecard;
