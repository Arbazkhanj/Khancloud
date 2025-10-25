// routes/file.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import File from "../models/File.js";
import User from "../models/User.js";

const router = express.Router();

/* -----------------------------
   FILE UPLOAD CONFIGURATION
--------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* -----------------------------
   🟢 Upload a New File
--------------------------------*/
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = new File({
      name: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uploadedAt: new Date(),
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------
   🟡 Get All Files
--------------------------------*/
router.get("/", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------
   🔴 Delete a File by ID
--------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    fs.unlinkSync(file.path);
    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------
   📊 Dashboard Stats
--------------------------------*/
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();

    res.json({
      users: totalUsers,
      files: totalFiles,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router };
