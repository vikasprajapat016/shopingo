import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { fetchCategories } from "../api/category";
import HomeSlider from "../components/HomeSlider";
import Category from "../components/shared/Category";
import { fetchTopProducts } from "../api/productApi";
import Card from "../components/Card";
import { fetchActiveOffers } from "../api/offerApi";
import {CardWrapper} from "../components/CrardWrapper"
const baseUrl = import.meta.env.VITE_API_URL

function Home() {
  const { loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [topProducts, setTopProducts] = useState([])



   const [offers, setOffers] = useState([]);

  const loadOffers = async () => {
    try {
      const res = await fetchActiveOffers();
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Failed to load offers", err);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategory = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      setError("Failed to load categories");
    }
  };



  const loadTopProducts = async () => {
    try {
       const res = await fetchTopProducts();
      setTopProducts(res.data.products || []);
    } catch (err) {
      setError("Failed to load categories");
    }
  }



    useEffect(() => {
    loadOffers();
  }, []);

  
  useEffect(() => {
    loadTopProducts()
    fetchCategory();
    
  }, []);



  // ---------------- AUTH LOADING ----------------
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= HERO SLIDER ================= */}
      <div className=" px-3 py-1 md:px-6 md:py-3 rounded-md ">
              <HomeSlider className="rounded-md"  />

      </div>
      {/* ================= AMAZON BODY ================= */}
      <div className="relative z-10 px-4 md:px-6 lg:px-10 space-y-8 mt-6">

        {/* ================= GREETING CARD ================= */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Hello{user?.username && `, ${user.username}`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Discover deals, categories, and products curated for you
          </p>
        </div>



        {/* ================= DEALS YOU MAY LIKE (BY CATEGORY) ================= */}
 <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Deals You May Like
        </h3>
        <button
          onClick={() => navigate("/product")}
          className="text-sm text-blue-600 hover:underline"
        >
          Explore
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {offers.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[180px] w-60 h-40 bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          : offers.map((offer) =>
              offer.categories.map((cat) => (
                <div
                  key={`${offer._id}-${cat._id}`}
                  className="min-w-[180px] w-60 flex-shrink-0 cursor-pointer group relative bg-white rounded-lg shadow hover:shadow-lg transition"
                  onClick={() => navigate(`/product/category/${cat._id}`)}
                >
                  <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                    <img
                      src={`${baseUrl}/${cat.image}` || `${baseUrl}/${offer.bannerImage}`}
                      alt={cat.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                      {cat.name}
                    </h3>
                    <span className="text-sm text-red-600 font-bold mt-1 block">
                      {offer.discountType === "percentage"
                        ? `Up to ${offer.discountValue}% OFF`
                        : `Save $${offer.discountValue}`}
                    </span>
                  </div>
                </div>
              ))
            )}
      </div>
    </div>





        {/* ================= SHOP BY CATEGORY ================= */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between px-6 pt-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Shop by Category
              </h3>
              <button
                onClick={() => navigate("/product")}
                className="text-sm text-blue-600 hover:underline"
              >
                See all
              </button>
            </div>

            <Category categories={categories} />
          </div>
        )}

        {/*================= PRODUCT RAIL (PLACEHOLDER) =================*/}
 

        <div className="bg-white rounded-lg shadow-sm p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-800">
      Top Picks for You
    </h3>
    <button
      onClick={() => navigate("/product")}
      className="text-sm text-blue-600 hover:underline"
    >
      View more
    </button>
  </div>

  {/* Product Blocks */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-18">
    {/* Block 1 */}
    <div className="bg-gray-100 rounded-md p-4 shadow-lg ">
      <div className="grid grid-cols-2 gap-4">
        {topProducts.slice(0, 4).map((product) => (
          <CardWrapper key={product._id}>
            <Card product={product} />
          </CardWrapper>
        ))}
      </div>
    </div>

    {/* Block 2 */}
    <div className="bg-gray-100 rounded-md p-4">
      <div className="grid grid-cols-2 gap-4">
        {topProducts.slice(4, 8).map((product) => (
          <CardWrapper key={product._id}>
            <Card product={product} />
          </CardWrapper>
        ))}
      </div>
    </div>
  </div>
</div>



        {/* ================= FOOTER SPACING ================= */}
        <div className="h-12" />
      </div>
    </div>
  );
}

export default Home;
