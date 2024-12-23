import mongoose from "mongoose";

const mallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  openTime: {
    type: String,
  },
  closeTime: {
    type: String
  }
});

export const Mall = mongoose.models.Mall || mongoose.model("Mall", mallSchema);
