import axios from "./axios";
import api from "./axios";

export const fetchProduct = (page, limit, category) => {
  return axios.get("/products/get", {
    params: {
      page,
      limit,
      category,
    },
  });
};


export const fetchTopProducts = () =>
    api.get("/products/top-product")