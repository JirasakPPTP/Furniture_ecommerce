import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = "cod" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const normalizedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product id in order items" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product: ${product.name}` });
      }

      normalizedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    const totalPrice = calculateTotal(normalizedItems);

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};
