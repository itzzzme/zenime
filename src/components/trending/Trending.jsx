import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

const Trending = ({ trending }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="mt-6 max-[1200px]:px-4 max-md:px-0">
      <h1 className="text-[#ffbade] text-2xl font-bold max-md:pl-4">
        Trending
      </h1>
      <div className="pr-[60px] relative mx-auto overflow-hidden z-[1] mt-6 max-[759px]:pr-0">
        <Swiper
          className="w-full h-full"
          slidesPerView={3}
          spaceBetween={2}
          breakpoints={{
            479: { spaceBetween: 15 },
            575: { spaceBetween: 15 },
            640: { slidesPerView: 3, spaceBetween: 15 },
            900: { slidesPerView: 4, spaceBetween: 15 },
            1300: { slidesPerView: 6, spaceBetween: 15 },
          }}
          modules={[Pagination, Navigation]}
          navigation={{
            nextEl: ".btn-next",
            prevEl: ".btn-prev",
          }}
        >
          {trending &&
            trending.map((item, idx) => (
              <SwiperSlide
                key={idx}
                className="text-center flex text-[18px] justify-center items-center"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                <div className="w-full h-auto pb-[115%] relative inline-block overflow-hidden max-[575px]:pb-[150%]">
                  <div className="absolute left-0 top-0 bottom-0 overflow-hidden w-[40px] text-center font-semibold bg-[#201F31] max-[575px]:top-0 max-[575px]:h-[30px] max-[575px]:z-[9] max-[575px]:bg-white">
                    <span className="absolute left-0 right-0 bottom-0 text-[24px] leading-[1.1em] text-cente z-[9] transform -rotate-90 max-[575px]:transform max-[575px]:rotate-0 max-[575px]:text-[#111] max-[575px]:text-[18px] max-[575px]:leading-[30px]">
                      {item.number}
                    </span>
                    <div className="w-[150px] h-fit text-left transform -rotate-90 absolute bottom-[100px] left-[-55px] leading-[40px] text-ellipsis whitespace-nowrap overflow-hidden text-white text-[16px] font-medium">
                      {language === "EN" ? item.title : item.japanese_title}
                    </div>
                  </div>
                  <Link
                    to={`/${item.id}`}
                    className="inline-block bg-[#2a2c31] absolute w-auto left-[40px] right-0 top-0 bottom-0 max-[575px]:left-0 max-[575px]:top-0 max-[575px]:bottom-0"
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="block w-full h-full object-cover hover:cursor-pointer"
                      title={item.title}
                      loading="lazy"
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="absolute top-0 right-0 bottom-0 w-[45px] flex flex-col space-y-2 max-[759px]:hidden">
          <div className="btn-next bg-[#383747] h-[50%] flex justify-center items-center rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffbade] hover:text-[#383747]">
            <FaChevronRight />
          </div>
          <div className="btn-prev bg-[#383747] h-[50%] flex justify-center items-center rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffbade] hover:text-[#383747]">
            <FaChevronLeft />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
