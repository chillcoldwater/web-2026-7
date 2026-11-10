import express, { type Request, type Response } from "express";
import { User } from "../models/User.ts";


export const userRouter = express.Router();


/**
 * @openapi
 * /users/:
 *   get:
 *     summary: Получить всех пользователей
 *     description: Возвращает всех пользователей из базы данных.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Список всех пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6731a1b2c3d4e5f6a7b8c9d0
 *                   name:
 *                     type: string
 *                     example: Иван
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: ivan@example.com
 *                   age:
 *                     type: number
 *                     example: 18
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Внутренняя ошибка сервера.
 */


userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по id
 *     description: Возвращает одного пользователя по его id.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID пользователя.
 *         schema:
 *           type: string
 *         example: 6731a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Пользователь найден.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 age:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Пользователь не найден или передан некорректный id.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */


userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res
        .status(400)
        .json({ message: "Пользователь с таким id не был найден", id: id });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
    }
  }
});


/**
 * @openapi
 * /users/:
 *   post:
 *     summary: Создать пользователя
 *     description: Создаёт нового пользователя в базе данных.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Иван
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               age:
 *                 type: number
 *                 example: 18
 *     responses:
 *       201:
 *         description: Пользователь успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Добавлен юзер с именем Иван
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     age:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Ошибка валидации данных.
 *       409:
 *         description: Пользователь с таким email уже существует.
 *       404:
 *         description: Неизвестная ошибка сервера.
 */


userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });


    res
      .status(201)
      .json({
        message: `Добавлен юзер с именем ${newUser.name}`,
        user: newUser,
      });
  } catch (error: any) {
    console.error(error);
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      res.status(409).json({
        message: `Пользователь с таким ${field} уже хранится в базе данных`,
      });
      return;
    }
    if (error?.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      res.status(400).json({
        message: "Ошибка валидации данных",
        errors: messages,
      });
    }
    res.status(404).send("Что-то пошло не так");
  }
});


/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Обновить пользователя
 *     description: Обновляет данные пользователя по его id.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID пользователя.
 *         schema:
 *           type: string
 *         example: 6731a1b2c3d4e5f6a7b8c9d0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Иван
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               age:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Пользователь успешно обновлён.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь с id=6731a1b2c3d4e5f6a7b8c9d0 был обновлен
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     age:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Некорректный id, ошибка валидации или email уже занят.
 *       404:
 *         description: Пользователь не найден.
 */


userRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;
    const { id } = req.params;
    const editedUser = await User.findByIdAndUpdate(
      id,
      { name, email, age },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );
    if (!editedUser) {
      res
        .status(404)
        .json({ message: "Пользователь с данным id не найден", id: id });
      return;
    }
    res.status(201).json({
      message: `Пользователь с id=${editedUser._id} был обновлен`,
      user: editedUser,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      console.error(error);
      const field = Object.keys(error.keyValue || {})[0];
      res.status(400).json({
        message: `Пользователь с таким ${field} уже присутствует!`,
      });
    }
    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
    }
    res.status(400).json(error);
  }
});


/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     description: Удаляет пользователя из базы данных по его id.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID пользователя.
 *         schema:
 *           type: string
 *         example: 6731a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Пользователь успешно удалён.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 age:
 *                   type: number
 *       400:
 *         description: Пользователь не найден или передан некорректный id.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */


userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res
        .status(400)
        .json({ message: "Пользователь с таким id не был найден", id: id });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
    }
  }
});