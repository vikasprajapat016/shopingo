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
    className="w-full aspect-[16/9] sm:aspect-[21/9] mt-20 sm:mt-6 md:mt-20 rounded
               [&_.swiper-pagination-bullet]:bg-white
               [&_.swiper-pagination-bullet-active]:bg-indigo-600"
>

    
      {sliders.map((s) => (
        <SwiperSlide key={s._id}>
          {s.link ? (
            <a href={s.link}>
        <img
  src={`${baseUrl}/${s.image}`}
  alt={s.title}
  className="w-full h-full object-contain sm:object-cover rounded-md"
  loading="lazy"
/>

            </a>
          ) : (
         <img
  src={`${baseUrl}/${s.image}`}
  alt={s.title}
  className="w-full h-full object-contain sm:object-cover rounded-md"
  loading="lazy"
/>

          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
