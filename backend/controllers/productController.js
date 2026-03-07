import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const parseImagesFromRequest = (req) => {
  if (req.files?.length) {
    return req.files.map((file) => `/uploads/${file.filename}`);
  }

  if (Array.isArray(req.body.images)) {
    return req.body.images;
  }

  if (typeof req.body.images === "string" && req.body.images.trim()) {
    return req.body.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      search = "",
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const currentPage = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort(sort)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, rating = 0 } = req.body || {};
    const images = parseImagesFromRequest(req);

    const missingFields = [];
    if (!String(name || "").trim()) missingFields.push("name");
    if (!String(description || "").trim()) missingFields.push("description");
    if (!String(category || "").trim()) missingFields.push("category");
    if (price === undefined || price === null || String(price).trim() === "") missingFields.push("price");
    if (stock === undefined || stock === null || String(stock).trim() === "") missingFields.push("stock");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required product fields: ${missingFields.join(", ")}`,
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      images,
      stock: Number(stock),
      rating: Number(rating || 0),
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { category } = req.body;
    const updates = { ...req.body };
    const uploadedImages = parseImagesFromRequest(req);

    if (uploadedImages.length > 0) {
      updates.images = uploadedImages;
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
    }

    if (updates.rating !== undefined) {
      updates.rating = Number(updates.rating);
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    return next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const productsUsingCategory = await Product.countDocuments({ category: req.params.id });
    if (productsUsingCategory > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category assigned to one or more products" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
