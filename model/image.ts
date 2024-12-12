import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

export const ImageModel =
  mongoose.models.image || mongoose.model("image", imageSchema);
