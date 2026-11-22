import type { Request, Response } from "express";
import { User } from "../models/User.ts";
import bcrypt from "bcrypt";

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
  
  res.status(201)
  res.json({ message: `Пользователь ${user.name} успешно авторизован`, user });
}
