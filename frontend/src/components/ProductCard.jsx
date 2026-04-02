import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/imageUrl";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:shadow-md">
      <Link to={`/products/${product._id}`}>
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
          }}
          className="h-52 w-full object-cover"
        />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">{product.name}</h3>
          <p className="text-sm text-stone-500">{product.category?.name || "ไม่ระบุหมวดหมู่"}</p>
        </div>
        <p className="text-sm text-stone-600">คะแนน: {product.rating || 0}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">฿{product.price}</span>
          <button
            onClick={() => addToCart(product, 1)}
            className="rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
