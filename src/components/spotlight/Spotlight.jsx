import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "./Spotlight.css";
import Banner from "../banner/Banner";

const Spotlight = ({ spotlights }) => {
  return (
    <>
      <div className="relative h-[600px] max-[1390px]:h-[530px] max-[1300px]:h-[500px] max-md:h-[420px]">
        <div className="absolute right-[10px] bottom-0 flex flex-col space-y-2 z-10 max-[575px]:hidden">
          <div className="button-next"></div>
          <div className="button-prev"></div>
        </div>
        {spotlights && spotlights.length > 0 ? (
          <>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              allowTouchMove={false}
              navigation={{
                nextEl: ".button-next",
                prevEl: ".button-prev",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Navigation, Autoplay]}
              className="h-[600px] max-[1390px]:h-full"
              style={{
                "--swiper-pagination-bullet-inactive-color": "#ffffff",
                "--swiper-pagination-bullet-inactive-opacity": "1",
              }}
            >
              {spotlights.map((item, index) => (
                <SwiperSlide className="text-black relative" key={index}>
                  <Banner item={item} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <p>No spotlights to show.</p>
        )}
      </div>
    </>
  );
};

export default Spotlight;
