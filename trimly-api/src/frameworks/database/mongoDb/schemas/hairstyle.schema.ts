import { Schema } from "mongoose";
import { IHairstyleModel } from "../models/hairstyle.model.js";

export const hairstyleSchema = new Schema<IHairstyleModel>(
  {
    hairstyleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    faceShapes: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
