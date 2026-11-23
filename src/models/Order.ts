import { Schema, model, Types } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a2b3c4d5e6f7a8b9c0d1
 *         user:
 *           type: string
 *           description: ID пользователя
 *           example: 65f1a2b3c4d5e6f7a8b9c0d2
 *         product:
 *           type: string
 *           description: ID товара
 *           example: 65f1a2b3c4d5e6f7a8b9c0d3
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         totalPrice:
 *           type: integer
 *           minimum: 0
 *           description: Итоговая стоимость в копейках
 *           example: 199800
 *         status:
 *           type: string
 *           enum: [created, paid, shipped, cancelled]
 *           default: created
 *           example: created
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderPopulated:
 *       allOf:
 *         - $ref: '#/components/schemas/Order'
 *         - type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f1a2b3c4d5e6f7a8b9c0d2
 *                 name:
 *                   type: string
 *                   example: Иван Иванов
 *                 email:
 *                   type: string
 *                   example: ivan@example.com
 *             product:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f1a2b3c4d5e6f7a8b9c0d3
 *                 title:
 *                   type: string
 *                   example: Беспроводная мышь
 *                 price:
 *                   type: integer
 *                   example: 99900
 *
 *     CreateOrderInput:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - quantity
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя
 *           example: 65f1a2b3c4d5e6f7a8b9c0d2
 *         productId:
 *           type: string
 *           description: ID товара
 *           example: 65f1a2b3c4d5e6f7a8b9c0d3
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Количество единиц товара
 *           example: 2
 *
 *     UpdateOrderStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [created, paid, shipped, cancelled]
 *           description: Новый статус заказа
 *           example: paid
 */
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