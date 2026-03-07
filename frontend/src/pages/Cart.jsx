import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/imageUrl";

const Cart = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">ตะกร้าสินค้า</h1>

      {cartItems.length === 0 ? (
        <div className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
          <p className="text-stone-600">ยังไม่มีสินค้าในตะกร้า</p>
          <Link to="/products" className="mt-4 inline-block text-brand-700 hover:text-brand-800">
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 ring-1 ring-stone-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="h-16 w-20 rounded object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-stone-900">{item.name}</h2>
                    <p className="text-sm text-stone-500">${item.price} / ชิ้น</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(item.stock || 1, 1)}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item._id, Number(event.target.value))}
                    className="w-20 rounded border border-stone-300 px-2 py-1"
                  />
                  <button onClick={() => removeFromCart(item._id)} className="text-sm text-red-600 hover:text-red-700">
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
            <p className="text-lg font-semibold">ยอดรวมย่อย: ${subtotal.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-white hover:bg-brand-800"
            >
              ไปหน้าชำระเงิน
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
