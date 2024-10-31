import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";

function Cart({ label, data, path }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, data);
  const handleMouseEnter = (item) => {
    const timeout = setTimeout(() => {
      setHoveredItem(item.id);
    }, 300);
    setHoverTimeout(timeout);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredItem(null);
  };
  return (
    <div className="flex flex-col w-1/4 space-y-7 max-[1200px]:w-full">
      <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl">
        {label}
      </h1>
      <div className="w-full space-y-4 flex flex-col">
        {data &&
          data.slice(0, 5).map((item, index) => (
            <div
              key={index}
              style={{ borderBottom: "1px solid rgba(255, 255, 255, .075)" }}
              className="flex pb-4 items-center relative"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <img
                src={item.poster}
                alt={item.title}
                className="flex-shrink-0 w-[60px] h-[75px] rounded-md object-cover cursor-pointer"
                loading="lazy"
                onClick={() => navigate(`/watch/${item.id}`)}
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              />
              {hoveredItem === item.id && window.innerWidth > 1024 && (
                <div
                  className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} 
            ${
              tooltipHorizontalPosition === "left-1/2"
                ? "translate-x-[-100px]"
                : "translate-x-[-200px]"
            } 
            z-[100000] transform transition-all duration-300 ease-in-out 
            ${
              hoveredItem === item.id
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
                >
                  <Qtip id={item.id} />
                </div>
              )}

              <div className="flex flex-col ml-4 space-y-2 w-full">
                <Link
                  to={`/${item.id}`}
                  className="w-full line-clamp-2 text-[1em] font-[500] hover:cursor-pointer hover:text-[#ffbade] transform transition-all ease-out max-[1200px]:text-[14px]"
                >
                  {language === "EN" ? item.title : item.japanese_title}
                </Link>
                <div className="flex items-center flex-wrap w-fit space-x-1">
                  {item.tvInfo?.sub && (
                    <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[4px] px-[4px] text-black py-[2px]">
                      <FontAwesomeIcon
                        icon={faClosedCaptioning}
                        className="text-[12px]"
                      />
                      <p className="text-[12px] font-bold">{item.tvInfo.sub}</p>
                    </div>
                  )}

                  {item.tvInfo?.dub && (
                    <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[4px] px-[8px] text-black py-[2px]">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-[12px]"
                      />
                      <p className="text-[12px] font-bold">{item.tvInfo.dub}</p>
                    </div>
                  )}
                  <div className="flex items-center w-fit pl-1 gap-x-1">
                    <div className="dot"></div>
                    <p className="text-[14px] text-[#D2D2D3]">
                      {item.tvInfo.showType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <Link
          to={`/${path}`}
          className="flex w-fit items-baseline rounded-3xl gap-x-2 group"
        >
          <p className="text-white text-[17px] h-fit leading-4 group-hover:text-[#ffbade] transform transition-all ease-out">
            View more
          </p>
          <FaChevronRight className="text-white text-[10px] group-hover:text-[#ffbade] transform transition-all ease-out" />
        </Link>
      </div>
    </div>
  );
}

export default Cart;
