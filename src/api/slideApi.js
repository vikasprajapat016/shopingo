import api from "./axios";

/* PUBLIC – USER WEBSITE */
export const fetchActiveSliders = () =>
  api.get("admin/active/sliders");



export const fetchProducts = (page = 1, limit = 10) => {
  return api.get(`/admin/products`, {
    params: { page, limit },
    withCredentials: true,
  });
};