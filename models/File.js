import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedBy: String,
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);
export default File;