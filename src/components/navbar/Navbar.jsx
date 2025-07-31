import { useState, useEffect } from "react";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilm,
  faRandom,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";
import { FaTelegramPlane } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isNotHomePage, setIsNotHomePage] = useState(
    location.pathname !== "/" && location.pathname !== "/home"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHamburgerClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  const handleRandomClick = () => {
    if (location.pathname === "/random") {
      window.location.reload();
    }
  };
  useEffect(() => {
    setIsNotHomePage(
      location.pathname !== "/" && location.pathname !== "/home"
    );
  }, [location.pathname]);

  return (
    <SearchProvider>
      <nav
        className={`fixed top-0 left-0 w-full h-16 z-[1000000] flex p-4 py-8 items-center justify-between transition-all duration-300 ease-in-out ${
          isNotHomePage ? "bg-[#201F31]" : "bg-opacity-0"
        } ${
          isScrolled ? "bg-[#2D2B44] bg-opacity-90 backdrop-blur-md" : ""
        } max-[600px]:h-fit max-[600px]:flex-col max-[1200px]:bg-opacity-100 max-[600px]:py-2`}
      >
        <div className="flex gap-x-6 items-center w-fit max-lg:w-full max-lg:justify-between">
          <div className="flex gap-x-6 items-center w-fit">
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl text-white mt-1 cursor-pointer"
              onClick={handleHamburgerClick}
            />
            <Link
              to="/"
              className="text-4xl font-bold max-[575px]:text-3xl cursor-pointer"
            >
              {logoTitle.slice(0, 3)}
              <span className="text-[#FFBADE]">{logoTitle.slice(3, 4)}</span>
              {logoTitle.slice(4)}
            </Link>
          </div>
          <WebSearch />
        </div>
        <div className="flex gap-x-7 items-center max-lg:hidden">
          {[
            { icon: faRandom, label: "Random", path: "/random" },
            { icon: faFilm, label: "Movie", path: "/movie" },
            { icon: faStar, label: "Popular", path: "/most-popular" },
          ].map((item) => (
            <Link
              key={item.path}
              to={
                item.path === "/random"
                  ? location.pathname === "/random"
                    ? "#"
                    : "/random"
                  : item.path
              }
              onClick={item.path === "/random" ? handleRandomClick : undefined}
              className="flex flex-col gap-y-1 items-center cursor-pointer"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-[#ffbade] text-xl font-bold"
              />
              <p className="text-[15px]">{item.label}</p>
            </Link>
          ))}
          <div className="flex flex-col gap-y-1 items-center w-auto">
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
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="w-full">
              <p className="whitespace-nowrap text-[15px]">Anime name</p>
            </div>
          </div>
          <Link
            to="https://t.me/zenime_discussion"
            className="flex flex-col gap-y-1 items-center cursor-pointer"
          >
            <FaTelegramPlane
              // icon={faTelegram}
              className="text-xl font-bold text-[#ffbade]"
            />
            <p className="text-[15px] mb-[1px] text-white">Join Telegram</p>
          </Link>
        </div>
        <MobileSearch />
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </SearchProvider>
  );
}

export default Navbar;
