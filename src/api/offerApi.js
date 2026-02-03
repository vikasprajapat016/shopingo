import api from "./axios";


export const fetchOffers = () =>
  api.get("/admin/offers");


export const fetchOfferProducts = (id) => 
  api.get(`/user/offers/category/${id}`)



export const fetchActiveOffers = () => api.get("/user/top/deals");
