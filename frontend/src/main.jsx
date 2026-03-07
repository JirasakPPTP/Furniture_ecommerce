import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import api from "./services/api";
import "./index.css";

const Root = () => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const syncProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await api.get("/auth/profile");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      } catch (_error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    syncProfile();
  }, []);

  const handleAuthSuccess = ({ token, user: authedUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authedUser));
    setUser(authedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <CartProvider>
        <App user={user} onAuthSuccess={handleAuthSuccess} onLogout={handleLogout} />
      </CartProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
