import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    openTime: {
        type: String
    },
    closeTime: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: []
    },
    video: {
        type: String
    }
});

export const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);