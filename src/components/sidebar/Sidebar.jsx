import { FaChevronLeft } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faRandom } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  cleanupScrollbar,
  toggleScrollbar,
} from "@/src/helper/toggleScrollbar";

const Sidebar = ({ isOpen, onClose }) => {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    toggleScrollbar(isOpen);
    return () => {
      cleanupScrollbar();
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed top-0 left-0 bottom-0 right-0 w-screen h-screen transform transition-all duration-400 ease-in-out ${
            isOpen ? "backdrop-blur-lg" : "backdrop-blur-none"
          }`}
          onClick={onClose}
          style={{ zIndex: 1000000, background: "rgba(32, 31, 49, .8)" }}
        />
      )}

      <div
        className={`fixed h-full top-0 left-0 z-50 flex transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 1000200 }}
      >
        <div
          className="bg-white/10 w-[260px] py-8 h-full flex flex-col items-start max-[575px]:w-56 overflow-y-auto sidebar"
          style={{
            zIndex: 300,
            borderRight: "1px solid rgba(0, 0, 0, .1)",
          }}
        >
          <div className="px-4 w-full">
            <button
              onClick={onClose}
              className="w-full text-white flex items-baseline h-fit gap-x-1 z-[100] px-3 py-2 bg-[#4f4d6e] rounded-3xl"
            >
              <FaChevronLeft className="text-sm font-bold" />
              <p>Close menu</p>
            </button>
          </div>
          <div className="flex gap-x-7 w-full py-3 justify-center px-auto mt-8 bg-black/10 max-[575px]:gap-x-4 lg:hidden">
            {[
              { icon: faRandom, label: "Random" },
              { icon: faFilm, label: "Movie" },
            ].map((item, index) => (
              <Link
                to={`/${item.label}`}
                key={index}
                className="flex flex-col gap-y-1 items-center"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-[#ffbade] text-xl font-bold max-[575px]:text-[15px]"
                />
                <p className="text-[15px] max-[575px]:text-[13px]">
                  {item.label}
                </p>
              </Link>
            ))}
            <div className="flex flex-col gap-y-1 items-center w-auto justify-center">
              <div className="flex">
                {["EN", "JP"].map((lang, index) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-1 py-[1px] text-xs font-bold ${
                      index === 0 ? "rounded-l-[3px]" : "rounded-r-[3px]"
                    } ${
                      language === lang
                        ? "bg-[#ffbade] text-black"
                        : "bg-gray-600 text-white"
                    } max-[575px]:text-[9px] max-[575px]:py-0`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="w-full">
                <p className="whitespace-nowrap text-[15px] max-[575px]:text-[13px]">
                  Anime name
                </p>
              </div>
            </div>
          </div>
          <ul className="text-white mt-8 w-full">
            {[
              { name: "Home", path: "/home" },
              { name: "Subbed Anime", path: "/subbed-anime" },
              { name: "Dubbed Anime", path: "/dubbed-anime" },
              { name: "Most Popular", path: "/most-popular" },
              { name: "Movies", path: "/movie" },
              { name: "TV Series", path: "/tv" },
              { name: "OVAs", path: "/ova" },
              { name: "ONAs", path: "/ona" },
              { name: "Specials", path: "/special" },
              {
                name: "Join Telegram",
                path: "https://t.me/zenime_discussion",
              },
            ].map((item, index) => (
              <li
                key={index}
                className="py-4 w-full font-semibold"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, .08)" }}
              >
                <Link
                  to={item.path}
                  className="px-4 hover:text-[#ffbade] hover:cursor-pointer w-fit line-clamp-1"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
