import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // в копейках
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["created", "paid", "shipped", "cancelled"],
      default: "created",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model("Order", orderSchema);