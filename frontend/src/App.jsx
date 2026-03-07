import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const PrivateRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = ({ user, onAuthSuccess, onLogout }) => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} onLogout={onLogout} />
      <main className="container-page py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout user={user} />} />
          <Route path="/login" element={<Login onAuthSuccess={onAuthSuccess} />} />
          <Route path="/register" element={<Register onAuthSuccess={onAuthSuccess} />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute user={user}>
                <Profile user={user} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
