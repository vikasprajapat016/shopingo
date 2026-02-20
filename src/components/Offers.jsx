import { fetchOffers } from "../api/offerApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers().then(res =>
      setOffers(res.data.availableOffers || [])
    );
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 bg-gray-50 mt-15">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        🔥 Current Offers
      </h1>

      {offers.length === 0 && (
      <div className="flex justify-center items-center">
          <p className="text-gray-500 text-lg ">
          No offers available right now
        </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div
            key={offer._id}
            onClick={() => navigate(`/offers/${offer._id}`)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden
                        shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* Banner Image */}
            <img
              src={`${import.meta.env.VITE_API_URL}${offer.bannerImage}`}
              alt={offer.title}
              className="h-52 w-full object-cover
                        group-hover:scale-110 transition duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t
                            from-black/80 via-black/40 to-transparent" />

            {/* Discount Badge */}
            <span className="absolute top-4 right-4 bg-red-600 text-white
                  px-3 py-1 rounded-full text-sm font-bold">
              {offer.discountType === "percentage"
                ? `${offer.discountValue}% OFF`
                : `₹${offer.discountValue} OFF`}
            </span>

            {/* Content */}
            <div className="absolute bottom-0 p-5 text-white">
              <h3 className="text-xl font-bold leading-tight">
                {offer.title}
              </h3>
              <p className="text-sm opacity-90 mt-1">
                Tap to view products →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
