import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";
import useCart from "../hooks/useCart";
import api from "../services/api";
import { getImageUrl } from "../services/imageUrl";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "โหลดข้อมูลสินค้าไม่สำเร็จ");
      }
    };

    loadProduct();
  }, [id]);

  if (error) return <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>;
  if (!product) return <p className="text-stone-500">กำลังโหลดรายละเอียดสินค้า...</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <img
        src={getImageUrl(product.images?.[0])}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
        }}
        className="h-full max-h-[500px] w-full rounded-xl object-cover"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>
        <p className="text-sm text-stone-500">หมวดหมู่: {product.category?.name}</p>
        <Rating value={product.rating || 0} />
        <p className="text-2xl font-bold text-brand-700">${product.price}</p>
        <p className="leading-relaxed text-stone-700">{product.description}</p>
        <p className="text-sm text-stone-500">สต๊อก: {product.stock}</p>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={Math.max(product.stock, 1)}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-24 rounded-md border border-stone-300 px-3 py-2"
          />
          <button
            onClick={() => addToCart(product, quantity)}
            className="rounded-md bg-brand-700 px-4 py-2 font-medium text-white hover:bg-brand-800"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
