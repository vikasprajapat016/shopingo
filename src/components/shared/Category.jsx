import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const CategoryShowcase = ({ categories = [] }) => {
  const navigate = useNavigate();

  if (!categories.length) {
    return (
      <p className="text-gray-400 p-6 text-center">
        No categories found
      </p>
    );
  }

  // CONFIG
  const SLIDER_SIZE = 10;
  const ROW_SIZE = 10;

  // Split sections
  const sections = [];
  for (let i = 0; i < categories.length; i += SLIDER_SIZE + ROW_SIZE) {
    sections.push({
      slider: categories.slice(i, i + SLIDER_SIZE),
      row: categories.slice(i + SLIDER_SIZE, i + SLIDER_SIZE + ROW_SIZE),
    });
  }

  return (
    <div className="px-4 md:px-8 lg:px-14 py-6 space-y-16">
      {sections.map((section, index) => (
        <div key={index} className="space-y-8">

          {/* ================= HERO SLIDER ================= */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {section.slider.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/product/category/${cat._id}`)}
                className="min-w-[300px] h-44 relative rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition"
              >
                <img
                  src={
                    cat.image
                      ? `${import.meta.env.VITE_API_URL}/${cat.image}`
                      : "/placeholder.png"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <p className="text-white text-lg font-semibold capitalize">
                    {cat.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ================= AMAZON STYLE ROW ================= */}
          {section.row.length > 0 && (
            <AmazonRow
              title="Related categories"
              items={section.row}
              onClick={(id) => navigate(`/product/category/${id}`)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryShowcase;

/* ================= AMAZON ROW COMPONENT ================= */

const AmazonRow = ({ title, items, onClick }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    rowRef.current.scrollBy({
      left: dir === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>
        <Link
        to="/product"
        className="text-sm text-blue-600 cursor-pointer hover:underline ">
          See more
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        ◀
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        ▶
      </button>

      {/* Row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
      >
        {items.map((cat) => (
          <div
            key={cat._id}
            onClick={() => onClick(cat._id)}
            className="min-w-[180px] bg-white rounded-md border cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={
                cat.image
                  ? `${import.meta.env.VITE_API_URL}/${cat.image}`
                  : "/placeholder.png"
              }
              alt={cat.name}
              className="h-36 w-full object-cover rounded-t-md"
            />
            <div className="p-2">
              <p className="text-sm font-medium text-gray-800 capitalize line-clamp-2">
                {cat.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
