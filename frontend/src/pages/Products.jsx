import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const result = {};
    if (filters.search) result.search = filters.search;
    if (filters.category) result.category = filters.category;
    result.limit = 24;
    return result;
  }, [filters]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoryRes] = await Promise.all([
          api.get("/products", { params }),
          api.get("/products/categories/list"),
        ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "โหลดสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          />
        </div>
        <select
          value={filters.category}
          onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 focus:border-brand-500 focus:outline-none"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? <p className="text-stone-500">กำลังโหลดสินค้า...</p> : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {!loading && products.length === 0 && <p className="text-stone-500">ไม่พบสินค้า</p>}
    </div>
  );
};

export default Products;
