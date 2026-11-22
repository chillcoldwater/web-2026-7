import { Router } from "express";
import * as auth from "../controllers/auth.ts"

export const authRouter = Router()

/**
 * @openapi
 * /login/:
 *   post:
 *     summary: Авторизоваться
 *     description: Авторизация по почте и паролю
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/AuthUserInput'
 *     responses:
 *       201:
 *         description: Пользователь успешно авторизован.
 *         content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/LoginSuccess'
 *       401:
 *         description: Неправильный логин или пароль.
 *         content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Unauthorized'
 */
authRouter.post("/", auth.login);


