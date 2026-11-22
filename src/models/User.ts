import { Schema, model } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Иван
 *         email:
 *           type: string
 *           format: email
 *           example: ivan@example.com
 *         age:
 *           type: number
 *           example: 18
 *         password:
 *           type: string
 *           minLength: 6
 *           example: saskfW23_s
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a2b3c4d5e6f7a8b9c0d1
 *         name:
 *           type: string
 *           example: Иван
 *         email:
 *           type: string
 *           format: email
 *           example: ivan@example.com
 *         age:
 *           type: number
 *           example: 18
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 18,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    timestamps: true,
  },
);

userSchema.set("toJSON", {
  transform(_document, result) {
    const {passwordHash, ...publicUser} = result
    return publicUser
  }
})

export const User = model("User", userSchema);
