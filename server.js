// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Routes
import { router as authRoutes } from "./routes/auth.js";
import { router as fileRoutes } from "./routes/file.js";
import connectDB from "./config/db.js";

// Initialize
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Serve static files (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("✅ KhanCloud Backend is running successfully!");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));