import type { Request, Response } from "express";
import { User } from "../models/User.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";

export const secret = "efmkwdSDkmfeE23Aksdmf";
export interface AuthJwtPayload extends JwtPayload {
  id: Types.ObjectId;
  email: string;
}
/**
 * @openapi
 * components:
 *   schemas:
 *     AuthUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ivan@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: saskfW23_s
 *     LoginSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Пользователь успешно авторизован
 *         user:
 *           $ref: '#/components/schemas/User'
 *         accessToken:
 *           type: string
 *           example: hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsiYWN0a.asdfjfeWdiasS242
 *     Unauthorized:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Почта или пароль неправильны
 */

export async function login(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email }).select("+passwordHash");

  const isHashCorrect = await bcrypt.compare(
    password,
    user?.passwordHash ?? "",
  );

  if (!user || !isHashCorrect) {
    res.status(401);
    res.json({ error: "Почта или пароль неправильны" });
    return;
  }

  const accessToken = jwt.sign({ id: user._id, email: user.email }, secret, {
    algorithm: "HS256",
    issuer: "web-programming",
  });
  const message = `Пользователь ${user.name} успешно авторизован`;

  res.status(201);
  res.json({ message, user, accessToken });
}
