import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { fetchActiveSliders } from "../api/slideApi.js";

const baseUrl = import.meta.env.VITE_API_URL;

const HomeSlider = () => {
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    const loadSliders = async () => {
      try {
        const res = await fetchActiveSliders();
        setSliders(res.data.sliders || []);
      } catch (err) {
        console.error("Failed to load sliders");
      }
    };

    loadSliders();
  }, []);

  if (sliders.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-auto mt-16"
    >
      {sliders.map((s) => (
        <SwiperSlide key={s._id}>
          {s.link ? (
            <a href={s.link}>
              <img
                src={`${baseUrl}/${s.image}`}
                alt={s.title}
                className="w-full h-[420px] object-cover"
              />
            </a>
          ) : (
            <img
              src={`${baseUrl}/${s.image}`}
              alt={s.title}
              className="w-full h-[420px] object-cover"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
