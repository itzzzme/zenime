import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import Qtip from "../qtip/Qtip";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";

const CategoryCard = React.memo(
  ({
    label,
    data,
    showViewMore = true,
    className,
    categoryPage = false,
    cardStyle,
    path,
    limit,
  }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [showPlay, setShowPlay] = useState(false);
    if (limit) {
      data = data.slice(0, limit);
    }

    const [itemsToRender, setItemsToRender] = useState({
      firstRow: [],
      remainingItems: [],
    });

    const getItemsToRender = useCallback(() => {
      if (categoryPage) {
        const firstRow =
          window.innerWidth > 758 && data.length > 4 ? data.slice(0, 4) : [];
        const remainingItems =
          window.innerWidth > 758 && data.length > 4
            ? data.slice(4)
            : data.slice(0);
        return { firstRow, remainingItems };
      }
      return { firstRow: [], remainingItems: data.slice(0) };
    }, [categoryPage, data]);

    useEffect(() => {
      const handleResize = () => {
        setItemsToRender(getItemsToRender());
      };
      const newItems = getItemsToRender();
      setItemsToRender((prev) => {
        if (
          JSON.stringify(prev.firstRow) !== JSON.stringify(newItems.firstRow) ||
          JSON.stringify(prev.remainingItems) !==
            JSON.stringify(newItems.remainingItems)
        ) {
          return newItems;
        }
        return prev;
      });

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [getItemsToRender]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
      useToolTipPosition(hoveredItem, data);
    const handleMouseEnter = (item) => {
      const timeout = setTimeout(() => {
        setHoveredItem(item.id);
        setShowPlay(true);
      }, 400);
      setHoverTimeout(timeout);
    };
    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
      setHoveredItem(null);
      setShowPlay(false);
    };
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] capitalize">
            {label}
          </h1>
          {showViewMore && (
            <Link
              to={`/${path}`}
              className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group"
            >
              <p className="text-white text-[12px] font-semibold h-fit leading-0 group-hover:text-[#ffbade] transition-all ease-out">
                View more
              </p>
              <FaChevronRight className="text-white text-[10px] group-hover:text-[#ffbade] transition-all ease-out" />
            </Link>
          )}
        </div>
        <>
          {categoryPage && (
            <div
              className={`grid grid-cols-4 gap-x-3 gap-y-8 transition-all duration-300 ease-in-out ${
                categoryPage ? "mt-8 max-[758px]:hidden" : ""
              }`}
            >
              {itemsToRender.firstRow.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col transition-transform duration-300 ease-in-out"
                  style={{ height: "fit-content" }}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <div
                    className="w-full relative group hover:cursor-pointer"
                    onClick={() => navigate(`/watch/${item.id}`)}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredItem === item.id && showPlay && (
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-[40px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]"
                      />
                    )}

                    <div className="overlay"></div>
                    <div className="overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className={`w-full h-[320px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] group-hover:blur-[7px] transform transition-all duration-300 ease-in-out ultra-wide:h-[400px] ${cardStyle}`}
                      />
                    </div>
                    {(item.tvInfo?.rating === "18+" ||
                      item?.adultContent === true) && (
                      <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                        18+
                      </div>
                    )}
                    <div className="absolute left-2 bottom-3 flex items-center justify-center w-fit space-x-1 z-[100] max-[270px]:flex-col max-[270px]:gap-y-[3px]">
                      {item.tvInfo?.sub && (
                        <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[2px] px-[4px] text-black py-[2px]">
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
                        <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[2px] px-[8px] text-black py-[2px]">
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            className="text-[12px]"
                          />
                          <p className="text-[12px] font-bold">
                            {item.tvInfo.dub}
                          </p>
                        </div>
                      )}
                      {item.tvInfo?.eps && (
                        <div className="flex space-x-1 justify-center items-center bg-[#a9a6b16f] rounded-[2px] px-[8px] text-white py-[2px]">
                          <p className="text-[12px] font-extrabold">
                            {item.tvInfo.eps}
                          </p>
                        </div>
                      )}
                    </div>
                    {hoveredItem === item.id && window.innerWidth > 1024 && (
                      <div
                        className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[100000] transform transition-all duration-300 ease-in-out ${
                          hoveredItem === item.id
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                      >
                        <Qtip id={item.id} />
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/${item.id}`}
                    className="text-white font-semibold mt-1 item-title hover:text-[#FFBADE] hover:cursor-pointer line-clamp-1"
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </Link>
                  {item.description && (
                    <div className="line-clamp-3 text-[13px] font-extralight text-[#b1b0b0] max-[1200px]:hidden">
                      {item.description}
                    </div>
                  )}
                  <div className="flex items-center gap-x-2 w-full mt-2 overflow-hidden">
                    <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                      {item.tvInfo.showType.split(" ").shift()}
                    </div>
                    <div className="dot"></div>
                    <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                      {item.tvInfo?.duration === "m" ||
                      item.tvInfo?.duration === "?" ||
                      item.duration === "m" ||
                      item.duration === "?"
                        ? "N/A"
                        : item.tvInfo?.duration || item.duration || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-6 gap-x-3 gap-y-8 mt-6 transition-all duration-300 ease-in-out max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-2">
            {itemsToRender.remainingItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col transition-transform duration-300 ease-in-out"
                style={{ height: "fit-content" }}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <div
                  className="w-full relative group hover:cursor-pointer"
                  onClick={() => navigate(`/watch/${item.id}`)}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredItem === item.id && showPlay && (
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="text-[40px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]"
                    />
                  )}

                  <div className="overlay"></div>
                  <div className="overflow-hidden">
                    <img
                      src={item.poster}
                      alt={item.title}
                      loading="lazy"
                      className={`w-full h-[250px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] ${cardStyle} group-hover:blur-[7px] transform transition-all duration-300 ease-in-out `}
                    />
                  </div>
                  {(item.tvInfo?.rating === "18+" ||
                    item?.adultContent === true) && (
                    <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                      18+
                    </div>
                  )}
                  <div className="absolute left-2 bottom-4 flex items-center justify-center w-fit space-x-1 z-[100] max-[270px]:flex-col max-[270px]:gap-y-[3px]">
                    {item.tvInfo?.sub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[2px] px-[4px] text-black py-[2px]">
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
                      <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[2px] px-[8px] text-black py-[2px]">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                  </div>
                  {hoveredItem === item.id && window.innerWidth > 1024 && (
                    <div
                      className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[100000] transform transition-all duration-300 ease-in-out ${
                        hoveredItem === item.id
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                    >
                      <Qtip id={item.id} />
                    </div>
                  )}
                </div>
                <Link
                  to={`/${item.id}`}
                  className="text-white font-semibold mt-1 item-title hover:text-[#FFBADE] hover:cursor-pointer line-clamp-1"
                >
                  {language === "EN" ? item.title : item.japanese_title}
                </Link>
                <div className="flex items-center gap-x-2 w-full mt-2 overflow-hidden">
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo.showType.split(" ").shift()}
                  </div>
                  <div className="dot"></div>
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo?.duration === "m" ||
                    item.tvInfo?.duration === "?" ||
                    item.duration === "m" ||
                    item.duration === "?"
                      ? "N/A"
                      : item.tvInfo?.duration || item.duration || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
