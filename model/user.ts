import mongoose from "mongoose";

const roleEnum = ["admin", "user"];

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: roleEnum,
    default: "user",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png",
  },
  publicId: {
    type: String,
    default: "url"
  },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
