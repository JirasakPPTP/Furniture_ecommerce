import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/register", form);
      onAuthSuccess(data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 ring-1 ring-stone-200">
      <h1 className="mb-4 text-2xl font-bold text-stone-900">สมัครสมาชิก</h1>
      {error && <p className="mb-3 rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="ชื่อ-นามสกุล"
          className="w-full rounded border border-stone-300 px-3 py-2"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="อีเมล"
          className="w-full rounded border border-stone-300 px-3 py-2"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="รหัสผ่าน"
          className="w-full rounded border border-stone-300 px-3 py-2"
          minLength={6}
          required
        />
        <button type="submit" disabled={loading} className="w-full rounded-md bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:opacity-60">
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>

      <p className="mt-4 text-sm text-stone-600">
        มีบัญชีอยู่แล้ว? <Link to="/login" className="text-brand-700">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
};

export default Register;
