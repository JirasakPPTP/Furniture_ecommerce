import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 4, sort: "-rating" } });
        setFeatured(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "โหลดสินค้าแนะนำไม่สำเร็จ");
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-12 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">เฟอร์นิเจอร์เหนือกาลเวลา เพื่อบ้านที่คุณใส่ใจ</h1>
        <p className="mt-3 max-w-2xl text-brand-100">
          เลือกซื้อเฟอร์นิเจอร์และของตกแต่งบ้านสไตล์โมเดิร์น ที่คัดมาเพื่อความสวยงามและการใช้งานจริง
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
        >
          เลือกซื้อสินค้า
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-stone-900">สินค้าแนะนำ</h2>
          <Link to="/products" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            ดูทั้งหมด
          </Link>
        </div>

        {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
