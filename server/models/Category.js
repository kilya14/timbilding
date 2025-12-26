// server/models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        coverImage: { type: String },
        position: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);

export const Category = mongoose.model("Category", categorySchema);
