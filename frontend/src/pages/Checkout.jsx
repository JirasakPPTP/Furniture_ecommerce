import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import api from "../services/api";

const Checkout = ({ user }) => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("ยังไม่มีสินค้าในตะกร้า");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/orders", {
        items: cartItems.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          addressLine: form.addressLine,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
        },
        paymentMethod: form.paymentMethod,
      });

      clearCart();
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "ทำรายการสั่งซื้อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 ring-1 ring-stone-200 lg:col-span-2">
        <h1 className="text-2xl font-bold text-stone-900">ชำระเงิน</h1>

        {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="ชื่อ-นามสกุล" className="w-full rounded border border-stone-300 px-3 py-2" required />
        <input name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="ที่อยู่" className="w-full rounded border border-stone-300 px-3 py-2" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="city" value={form.city} onChange={handleChange} placeholder="เมือง" className="rounded border border-stone-300 px-3 py-2" required />
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="รหัสไปรษณีย์" className="rounded border border-stone-300 px-3 py-2" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="country" value={form.country} onChange={handleChange} placeholder="ประเทศ" className="rounded border border-stone-300 px-3 py-2" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="เบอร์โทรศัพท์" className="rounded border border-stone-300 px-3 py-2" required />
        </div>

        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full rounded border border-stone-300 px-3 py-2">
          <option value="cod">เก็บเงินปลายทาง</option>
          <option value="card">บัตรเครดิต/เดบิต</option>
          <option value="bank_transfer">โอนผ่านธนาคาร</option>
        </select>

        <button type="submit" disabled={loading} className="rounded-md bg-brand-700 px-4 py-2 font-medium text-white hover:bg-brand-800 disabled:opacity-60">
          {loading ? "กำลังสั่งซื้อ..." : "ยืนยันคำสั่งซื้อ"}
        </button>
      </form>

      <aside className="h-fit rounded-lg bg-white p-6 ring-1 ring-stone-200">
        <h2 className="text-lg font-semibold text-stone-900">สรุปคำสั่งซื้อ</h2>
        <p className="mt-3 text-stone-600">จำนวนรายการ: {cartItems.length}</p>
        <p className="mt-1 text-xl font-bold text-brand-700">ยอดรวม: ${subtotal.toFixed(2)}</p>
      </aside>
    </div>
  );
};

export default Checkout;
