import mongoose from "mongoose";
import { ImagesTypes } from "../@types/ImagesTypes";

const Schema = new mongoose.Schema<ImagesTypes>(
  {
    url: {
      type: String,
    },
    alt: {
      type: String,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

export default mongoose.model("Images", Schema);
