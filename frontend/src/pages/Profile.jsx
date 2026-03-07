import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const STATUS_TEXT = {
  pending: "รอดำเนินการ",
  paid: "ชำระเงินแล้ว",
  processing: "กำลังเตรียมสินค้า",
  shipped: "จัดส่งแล้ว",
  delivered: "ส่งสำเร็จ",
  cancelled: "ยกเลิก",
};

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  rating: "",
};

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newProductImages, setNewProductImages] = useState([]);
  const [newProduct, setNewProduct] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [editProductImages, setEditProductImages] = useState([]);
  const [editProduct, setEditProduct] = useState(emptyProductForm);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const ensureAuthAndAdmin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }

    if (!isAdmin) {
      setError("เฉพาะผู้ดูแลระบบเท่านั้น");
      return false;
    }

    return true;
  };

  const loadCommonData = async () => {
    const [ordersRes, categoriesRes, productsRes] = await Promise.all([
      api.get("/orders"),
      api.get("/products/categories/list"),
      api.get("/products", { params: { limit: 100 } }),
    ]);

    setOrders(ordersRes.data || []);
    setCategories(categoriesRes.data || []);
    setAdminProducts(productsRes.data.products || []);
  };

  const loadAdminUsers = async () => {
    if (!isAdmin) return;
    const { data } = await api.get("/users");
    setAdminUsers(data || []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadCommonData();
        await loadAdminUsers();
      } catch (err) {
        setError(err.response?.data?.message || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ");
      }
    };

    load();
  }, [isAdmin]);

  const createCategory = async () => {
    if (!ensureAuthAndAdmin()) return;
    if (!newCategory.trim()) return;

    try {
      await api.post("/products/categories", { name: newCategory.trim() });
      setNewCategory("");
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "เพิ่มหมวดหมู่ไม่สำเร็จ");
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!ensureAuthAndAdmin()) return;
    try {
      await api.delete(`/products/categories/${categoryId}`);
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "ลบหมวดหมู่ไม่สำเร็จ");
    }
  };

  const createProduct = async (event) => {
    event.preventDefault();
    if (!ensureAuthAndAdmin()) return;

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      formData.append("rating", newProduct.rating || "0");
      newProductImages.forEach((file) => formData.append("images", file));

      await api.post("/products", formData);

      setNewProduct(emptyProductForm);
      setNewProductImages([]);
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditProductImages([]);
    setEditProduct({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category?._id || product.category || "",
      stock: String(product.stock ?? ""),
      rating: String(product.rating ?? 0),
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId("");
    setEditProductImages([]);
    setEditProduct(emptyProductForm);
  };

  const updateProduct = async (productId) => {
    if (!ensureAuthAndAdmin()) return;

    try {
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      formData.append("category", editProduct.category);
      formData.append("stock", editProduct.stock);
      formData.append("rating", editProduct.rating || "0");
      editProductImages.forEach((file) => formData.append("images", file));

      await api.put(`/products/${productId}`, formData);
      cancelEditProduct();
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "อัปเดตสินค้าไม่สำเร็จ");
    }
  };

  const deleteProduct = async (id) => {
    if (!ensureAuthAndAdmin()) return;
    try {
      await api.delete(`/products/${id}`);
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
  };

  const deleteUser = async (id) => {
    if (!ensureAuthAndAdmin()) return;
    try {
      await api.delete(`/users/${id}`);
      await loadAdminUsers();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  const updateOrderStatus = async (orderId) => {
    if (!ensureAuthAndAdmin()) return;
    try {
      await api.put(`/orders/${orderId}/status`, { status: statusUpdate[orderId] || "pending" });
      await loadCommonData();
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError(err.response?.data?.message || "อัปเดตสถานะคำสั่งซื้อไม่สำเร็จ");
    }
  };

  if (!user) {
    return <p className="rounded bg-yellow-50 p-4 text-yellow-700">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">โปรไฟล์</h1>
        <p className="mt-2 text-stone-600">ชื่อ: {user.name}</p>
        <p className="text-stone-600">อีเมล: {user.email}</p>
        <p className="text-stone-600">สิทธิ์: {user.role}</p>
      </section>

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <section className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
        <h2 className="text-xl font-semibold text-stone-900">ประวัติคำสั่งซื้อ</h2>
        <div className="mt-4 space-y-3">
          {orders.length === 0 ? <p className="text-stone-500">ยังไม่มีคำสั่งซื้อ</p> : null}
          {orders.map((order) => (
            <div key={order._id} className="rounded border border-stone-200 p-4">
              <p className="font-semibold">คำสั่งซื้อ #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-stone-600">สถานะ: {STATUS_TEXT[order.status] || order.status}</p>
              <p className="text-sm text-stone-600">ยอดรวม: ${order.totalPrice.toFixed(2)}</p>
              <p className="text-sm text-stone-600">จำนวนรายการ: {order.items.length}</p>

              {isAdmin ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={statusUpdate[order._id] || order.status}
                    onChange={(event) =>
                      setStatusUpdate((prev) => ({ ...prev, [order._id]: event.target.value }))
                    }
                    className="rounded border border-stone-300 px-2 py-1 text-sm"
                  >
                    <option value="pending">รอดำเนินการ</option>
                    <option value="paid">ชำระเงินแล้ว</option>
                    <option value="processing">กำลังเตรียมสินค้า</option>
                    <option value="shipped">จัดส่งแล้ว</option>
                    <option value="delivered">ส่งสำเร็จ</option>
                    <option value="cancelled">ยกเลิก</option>
                  </select>
                  <button
                    onClick={() => updateOrderStatus(order._id)}
                    className="rounded bg-stone-900 px-3 py-1 text-sm text-white"
                  >
                    อัปเดต
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {isAdmin ? (
        <>
          <section className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">จัดการหมวดหมู่</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="ชื่อหมวดหมู่ใหม่"
                className="flex-1 rounded border border-stone-300 px-3 py-2"
              />
              <button onClick={createCategory} className="rounded bg-brand-700 px-4 py-2 text-white">
                เพิ่ม
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded border border-stone-200 p-3"
                >
                  <span>{category.name}</span>
                  <button onClick={() => deleteCategory(category._id)} className="text-sm text-red-600">
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">จัดการสินค้า</h2>
            <form onSubmit={createProduct} className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                className="rounded border border-stone-300 px-3 py-2"
                placeholder="ชื่อสินค้า"
                value={newProduct.name}
                onChange={(event) => setNewProduct((p) => ({ ...p, name: event.target.value }))}
                required
              />
              <input
                className="rounded border border-stone-300 px-3 py-2"
                placeholder="ราคา"
                type="number"
                min="0"
                value={newProduct.price}
                onChange={(event) => setNewProduct((p) => ({ ...p, price: event.target.value }))}
                required
              />
              <textarea
                className="rounded border border-stone-300 px-3 py-2 sm:col-span-2"
                placeholder="รายละเอียดสินค้า"
                value={newProduct.description}
                onChange={(event) => setNewProduct((p) => ({ ...p, description: event.target.value }))}
                required
              />
              <select
                className="rounded border border-stone-300 px-3 py-2"
                value={newProduct.category}
                onChange={(event) => setNewProduct((p) => ({ ...p, category: event.target.value }))}
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                className="rounded border border-stone-300 px-3 py-2"
                placeholder="จำนวนสต๊อก"
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(event) => setNewProduct((p) => ({ ...p, stock: event.target.value }))}
                required
              />
              <input
                className="rounded border border-stone-300 px-3 py-2 sm:col-span-2"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setNewProductImages(Array.from(event.target.files || []))}
              />
              <input
                className="rounded border border-stone-300 px-3 py-2"
                placeholder="คะแนน (0-5)"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={newProduct.rating}
                onChange={(event) => setNewProduct((p) => ({ ...p, rating: event.target.value }))}
              />
              <button type="submit" className="rounded bg-brand-700 px-4 py-2 text-white sm:col-span-2">
                เพิ่มสินค้า
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {adminProducts.map((product) => (
                <div key={product._id} className="rounded border border-stone-200 p-3">
                  {editingProductId === product._id ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="rounded border border-stone-300 px-3 py-2"
                        value={editProduct.name}
                        onChange={(event) => setEditProduct((p) => ({ ...p, name: event.target.value }))}
                      />
                      <input
                        className="rounded border border-stone-300 px-3 py-2"
                        type="number"
                        min="0"
                        value={editProduct.price}
                        onChange={(event) => setEditProduct((p) => ({ ...p, price: event.target.value }))}
                      />
                      <textarea
                        className="rounded border border-stone-300 px-3 py-2 sm:col-span-2"
                        value={editProduct.description}
                        onChange={(event) =>
                          setEditProduct((p) => ({ ...p, description: event.target.value }))
                        }
                      />
                      <select
                        className="rounded border border-stone-300 px-3 py-2"
                        value={editProduct.category}
                        onChange={(event) => setEditProduct((p) => ({ ...p, category: event.target.value }))}
                      >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <input
                        className="rounded border border-stone-300 px-3 py-2"
                        type="number"
                        min="0"
                        value={editProduct.stock}
                        onChange={(event) => setEditProduct((p) => ({ ...p, stock: event.target.value }))}
                      />
                      <input
                        className="rounded border border-stone-300 px-3 py-2 sm:col-span-2"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => setEditProductImages(Array.from(event.target.files || []))}
                      />
                      <input
                        className="rounded border border-stone-300 px-3 py-2"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={editProduct.rating}
                        onChange={(event) => setEditProduct((p) => ({ ...p, rating: event.target.value }))}
                      />
                      <div className="sm:col-span-2 flex gap-2">
                        <button
                          onClick={() => updateProduct(product._id)}
                          className="rounded bg-brand-700 px-4 py-2 text-white"
                        >
                          บันทึก
                        </button>
                        <button
                          onClick={cancelEditProduct}
                          className="rounded border border-stone-300 px-4 py-2"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-stone-900">{product.name}</p>
                        <p className="text-sm text-stone-500">
                          ${product.price} - สต๊อก {product.stock}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditProduct(product)}
                          className="text-sm text-brand-700"
                        >
                          แก้ไข
                        </button>
                        <button onClick={() => deleteProduct(product._id)} className="text-sm text-red-600">
                          ลบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">จัดการผู้ใช้</h2>
            <div className="mt-4 space-y-2">
              {adminUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded border border-stone-200 p-3">
                  <div>
                    <p className="font-medium text-stone-900">{u.name}</p>
                    <p className="text-sm text-stone-500">
                      {u.email} ({u.role})
                    </p>
                  </div>
                  <button onClick={() => deleteUser(u._id)} className="text-sm text-red-600">
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Profile;
