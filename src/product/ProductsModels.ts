import mongoose from "mongoose";
import { ProductType } from "../@types/ProductTypes";

const Schema = new mongoose.Schema<ProductType>(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
    },
    description: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    category: {
      type: String,
      enum: ["t-shirt", "kemeja", "celana", "jeans", "hoodie", "jacket"],
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    availableSize: [
      {
        sizeValue: {
          type: String,
        },
        quantity: {
          type: Number,
          min: 0,
        },
      },
    ],
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

export default mongoose.model("Product", Schema);
