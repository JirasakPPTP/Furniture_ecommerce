import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { categories, products, users } from "./seedData.js";

const run = async () => {
  try {
    await connectDB();

    await Promise.all([
      Order.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
    ]);

    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = new Map(categoryDocs.map((c) => [c.name, c._id]));

    const productDocs = products.map((p) => ({
      ...p,
      category: categoryMap.get(p.category),
    }));

    await Product.insertMany(productDocs);

    const userDocs = [];
    for (const user of users) {
      userDocs.push({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      });
    }

    await User.insertMany(userDocs);

    console.log("Database seeded successfully");
    console.log("Admin: admin@furniture.com / Admin@123");
    console.log("Customer: customer@furniture.com / Customer@123");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
