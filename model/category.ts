import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: [String]
    }
});

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);