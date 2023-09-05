import mongoose from "mongoose";
import { UserTypes } from "../@types/UserTypes";

const Schema = new mongoose.Schema<UserTypes>(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
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

export default mongoose.model("User", Schema);
