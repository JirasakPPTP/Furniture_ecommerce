import { Link, NavLink, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-brand-700" : "text-stone-600 hover:text-stone-900"}`;

const Navbar = ({ user, onLogout }) => {
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" className="text-lg font-bold tracking-tight text-brand-800">
          เเอปขายของตกเเต่ง
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className={linkClass}>
            HOME
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            PRODUCT
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            CART ({itemsCount})
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                PROFILE
              </NavLink>
              <button onClick={handleLogout} className="text-sm font-medium text-stone-600 hover:text-stone-900">
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                LOGIN
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                REGISTER
              </NavLink>
            </>
          )}
        </nav>

        <Link
          to="/cart"
          className="rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800 md:hidden"
        >
          �С��� ({itemsCount})
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
