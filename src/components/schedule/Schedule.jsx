import { useState, useEffect, useRef } from "react";
import getSchedInfo from "../../utils/getScheduleInfo.utils";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./schedule.css";
import { Link } from "react-router-dom";

const Schedule = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(null);
  const [scheduleData, setscheduleData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const cardRefs = useRef([]);
  const swiperRef = useRef(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "short" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const GMTOffset = `GMT ${
    new Date().getTimezoneOffset() > 0 ? "-" : "+"
  }${String(Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60)).padStart(
    2,
    "0"
  )}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, "0")}`;
  const months = [];

  useEffect(() => {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayname = date.toLocaleString("default", { weekday: "short" });
      const yearr = date.getFullYear();
      const monthh = String(date.getMonth() + 1).padStart(2, "0");
      const dayy = String(date.getDate()).padStart(2, "0");
      const fulldate = `${yearr}-${monthh}-${dayy}`;
      months.push({ day, monthName, dayname, fulldate });
    }
    setDates(months);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const todayIndex = dates.findIndex(
      (date) =>
        date.fulldate ===
        `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
    );

    if (todayIndex !== -1) {
      setCurrentActiveIndex(todayIndex);
      toggleActive(todayIndex);
    }
  }, [dates]);

  const fetchSched = async (date) => {
    try {
      setLoading(true);

      // Check if cached data exists
      const cachedData = localStorage.getItem(`schedule-${date}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setscheduleData(Array.isArray(parsedData) ? parsedData : []);
      } else {
        const data = await getSchedInfo(date);
        setscheduleData(Array.isArray(data) ? data : []);
        localStorage.setItem(`schedule-${date}`, JSON.stringify(data || []));
      }
    } catch (err) {
      console.error("Error fetching schedule info:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (index) => {
    cardRefs.current.forEach((card) => {
      if (card) {
        card.classList.remove("active");
      }
    });
    if (cardRefs.current[index]) {
      cardRefs.current[index].classList.add("active");
      if (dates[index] && dates[index].fulldate) {
        fetchSched(dates[index].fulldate);
      }
      setCurrentActiveIndex(index);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    setShowAll(false);
    if (currentActiveIndex !== null && swiperRef.current) {
      swiperRef.current.slideTo(currentActiveIndex);
    }
  }, [currentActiveIndex]);

  return (
    <>
      <div className="w-full mt-[60px] max-[480px]:mt-[40px]">
        <div className="flex items-center justify-between max-[570px]:flex-col max-[570px]:items-start max-[570px]:gap-y-2">
          <div className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]">
            Estimated Schedule
          </div>
          <p className="leading-[28px] px-[10px] bg-white text-black rounded-full my-[6px] text-[16px] font-bold max-[478px]:text-[12px] max-[275px]:text-[10px]">
            ({GMTOffset}) {currentTime.toLocaleDateString()}{" "}
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="w-full overflow-x-scroll space-x-4 scrollbar-hide pt-10 px-6 max-[480px]:px-4 max-[478px]:pt-4">
        <div className="relative w-full">
          <Swiper
            slidesPerView={3}
            spaceBetween={2}
            breakpoints={{
              250: { slidesPerView: 3, spaceBetween: 10 },
              640: { slidesPerView: 4, spaceBetween: 10 },
              768: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 7, spaceBetween: 10 },
              1300: { slidesPerView: 7, spaceBetween: 15 },
            }}
            modules={[Pagination, Navigation]}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {dates &&
              dates.map((date, index) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => (cardRefs.current[index] = el)}
                    onClick={() => toggleActive(index)}
                    className={`h-[70px] flex flex-col justify-center items-center w-full text-center rounded-xl shadow-lg cursor-pointer ${
                      currentActiveIndex === index
                        ? "bg-[#ffbade] text-black"
                        : "bg-white bg-opacity-5 text-[#ffffff] hover:bg-[#373646] transition-all duration-300 ease-in-out"
                    }`}
                  >
                    <div className="text-[18px] font-bold max-[400px]:text-[14px] max-[350px]:text-[12px]">
                      {date.dayname}
                    </div>
                    <div
                      className={`text-[14px] max-[400px]:text-[12px] ${
                        currentActiveIndex === index
                          ? "text-black"
                          : "text-gray-400"
                      } max-[350px]:text-[10px]`}
                    >
                      {date.monthName} {date.day}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
          <button className="next absolute top-1/2 right-[-15px] transform -translate-y-1/2 flex justify-center items-center cursor-pointer">
            <FaChevronRight className="text-[12px]" />
          </button>
          <button className="prev absolute top-1/2 left-[-15px] transform -translate-y-1/2 flex justify-center items-center cursor-pointer">
            <FaChevronLeft className="text-[12px]" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="w-full h-[70px] flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : !scheduleData || scheduleData.length === 0 ? (
        <div className="w-full h-[70px] flex justify-center items-center mt-5 text-xl">
          No data to display
        </div>
      ) : error ? (
        <div className="w-full h-[70px] flex justify-center items-center mt-5 text-xl">
          Something went wrong
        </div>
      ) : (
        <div className="flex flex-col mt-5 items-start">
          {(showAll
            ? scheduleData
            : Array.isArray(scheduleData)
            ? scheduleData.slice(0, 7)
            : []
          ).map((item, idx) => (
            <Link
              to={`/${item.id}`}
              key={idx}
              className="w-full flex justify-between py-4 border-[#FFFFFF0D] border-b-[1px] group cursor-pointer max-[325px]:py-2"
            >
              <div className="flex items-center max-w-[500px] gap-x-7 max-[400px]:gap-x-2">
                <div className="text-lg font-semibold text-[#ffffff59] group-hover:text-[#ffbade] transition-all duration-300 ease-in-out max-[600px]:text-[14px] max-[275px]:text-[12px]">
                  {item.time || "N/A"}
                </div>
                <h3 className="text-[17px] font-semibold line-clamp-1 group-hover:text-[#ffbade] transition-all duration-300 ease-in-out max-[600px]:text-[14px] max-[275px]:text-[12px]">
                  {item.title || "N/A"}
                </h3>
              </div>
              <button className="max-w-[150px] flex items-center py-1 px-4 rounded-lg gap-x-2 group-hover:bg-[#ffbade] transition-all duration-300 ease-in-out">
                <FontAwesomeIcon
                  icon={faPlay}
                  className="mt-[1px] text-[10px] max-[320px]:text-[8px] group-hover:text-black transition-all duration-300 ease-in-out"
                />
                <p className="text-[14px] text-white group-hover:text-black transition-all duration-300 ease-in-out max-[275px]:text-[12px]">
                  Episode {item.episode_no || "N/A"}
                </p>
              </button>
            </Link>
          ))}
          {scheduleData.length > 7 && (
            <button
              onClick={toggleShowAll}
              className="text-white py-4 hover:text-[#ffbade] font-semibold transition-all duration-300 ease-in-out max-sm:text-[13px]"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Schedule;
