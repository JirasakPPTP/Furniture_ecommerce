import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/login", { email, password });
      onAuthSuccess(data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 ring-1 ring-stone-200">
      <h1 className="mb-4 text-2xl font-bold text-stone-900">เข้าสู่ระบบ</h1>
      {error && <p className="mb-3 rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="อีเมล"
          className="w-full rounded border border-stone-300 px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="รหัสผ่าน"
          className="w-full rounded border border-stone-300 px-3 py-2"
          required
        />
        <button type="submit" disabled={loading} className="w-full rounded-md bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:opacity-60">
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="mt-4 text-sm text-stone-600">
        ยังไม่มีบัญชี? <Link to="/register" className="text-brand-700">สมัครสมาชิก</Link>
      </p>
    </div>
  );
};

export default Login;
