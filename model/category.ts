import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: [String]
    },
    malls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "malls"
    }]
});

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);