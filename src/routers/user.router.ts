import express, { type Request, type Response } from "express";
import { User } from "../models/User.ts";
import connectDB from "../utils/connectDB.ts";

export const userRouter = express.Router();
connectDB();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

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

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });

    res.status(201).json({message: `Добавлен юзер с именем ${newUser.name}`, user: newUser});
  } catch (error: any) {
    console.error(error);
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      res.status(409).json({
        message: `Пользователь с таким ${field} уже хранится в базе данных`
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
