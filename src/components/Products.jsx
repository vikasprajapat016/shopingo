import React, { useEffect, useState, useMemo } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Card from "./Card";
import { fetchCategories } from "../api/category";
import { fetchProduct } from "../api/productApi";
import toast from "react-hot-toast";

const Products = () => {
  const LIMIT = 12;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH PRODUCTS (BACKEND FILTERED) ---------------- */
  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await fetchProduct(page, LIMIT, selectedCategory);

      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH CATEGORIES ---------------- */
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* ---------------- CATEGORY CLICK ---------------- */
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1); // reset pagination
  };

  /* ---------------- SEARCH (FRONTEND ONLY) ---------------- */
  const searchedProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>

     <main className="bg-gray-50 min-h-screen pt-24 mb-10">
  <div className="max-w-7xl mx-auto px-4">

    {/* ================= CATEGORY SCROLL BAR ================= */}
    <div className="flex gap-3 overflow-x-auto py-3 mb-6">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`px-4 py-2 rounded-full border whitespace-nowrap ${
          !selectedCategory ? "bg-black text-white" : ""
        }`}
      >
        All
      </button>

      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => handleCategoryClick(c._id)}
          className={`px-4 py-2 rounded-full border whitespace-nowrap ${
            selectedCategory === c._id ? "bg-black text-white" : ""
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>

    {/* ================= SEARCH + COUNT ================= */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
      <input
        type="text"
        placeholder="Search products…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:w-96 px-4 py-2 border rounded focus:ring-2 focus:ring-gray-800"
      />

      <p className="text-sm text-gray-600 self-center">
        {searchedProducts.length} items
      </p>
    </div>

    {/* ================= PRODUCTS GRID ================= */}
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-72 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    ) : searchedProducts.length === 0 ? (
      <p className="text-gray-600">No products found.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchedProducts.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    )}

    {/* ================= PAGINATION ================= */}
    {totalPages > 1 && (
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="flex items-center">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}

  </div>
</main>

    </>
  );
};

export default Products;
