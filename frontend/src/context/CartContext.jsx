import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

const CART_KEY = "cart_items";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 999) }
            : item
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          stock: product.stock,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== productId) return item;
          return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 999)) };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemsCount };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
