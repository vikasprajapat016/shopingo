import { fetchOfferProducts, fetchOffers } from "../api/offerApi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const baseUrl = import.meta.env.VITE_API_URL


const OfferProducts = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfferProducts(id).then(res => {
      console.log(id)
      setOffer(res.data.offer);
      setProducts(res.data.products);
      console.log(products)
    });
  }, [id]);

  if (!offer) return null;

  return (
    <div className="px-4 md:px-10 py-6 mt-20">
      {/* Offer Banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}${offer.bannerImage}`}
          className="h-56 md:h-72 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              {offer.title}
            </h1>
            <p className="mt-2 text-lg font-semibold text-yellow-300">
              {offer.discountType === "percentage"
                ? `${offer.discountValue}% OFF`
                : `₹${offer.discountValue} OFF`}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p._id}`)}
            className="border rounded-xl p-3 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={`${baseUrl}/${p.thumbnail}`}
              className="h-50 w-full object-cover rounded-lg"
            />

            <h4 className="font-semibold mt-2 line-clamp-1">
              {p.title}
            </h4>

            <div className="mt-1">
              <span className="text-green-600 font-bold text-lg">
                ₹{p.price}
              </span>
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Offer Applied
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default OfferProducts;