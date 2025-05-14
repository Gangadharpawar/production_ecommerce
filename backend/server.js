// const express = require("express");

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
//config env
dotenv.config();
//database config
connectDB();
//rest object
const app = express();
//middelware
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));
app.use(cors());

//static files

const __dirname = path.resolve();

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
//rest api

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to ecommerce app",
  });
});

//port
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} Mode port ${port}`);
});
