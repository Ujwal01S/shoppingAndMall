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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s",
  },
  publicId: {
    type: String,
    default: "url"
  },
});

export const User =
  mongoose.models.User<{
    name: string;
    email: string;
    password: string;
    role: string;
    isAdmin: boolean;
    imageUrl: string;
    publicId: string;
  }> ||
  mongoose.model<{
    name: string;
    email: string;
    password: string;
    role: string;
    isAdmin: boolean;
    imageUrl: string;
    publicId: string;
  }>("User", userSchema);
