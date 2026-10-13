import express, { type Request, type Response } from "express";
import { filePath, findUser, readUsers, writeUsers, type User } from "../db.ts";

export const userRouter = express.Router();

userRouter.get("/:id", (req: Request, res: Response) => {
  const user = findUser(filePath, Number(req.params.id));

  if (!user) {
    res.status(404).send("Такого юзера нет");
    return;
  }

  res.json(user);
});

userRouter.post("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const name = req.body?.name;

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).send("Поле name обязательно");
    return;
  }

  if (findUser(filePath, id)) {
    res.status(409).send("Такой юзер уже есть");
    return;
  }

  const users = readUsers(filePath);
  const newUser: User = { id, name };

  users.push(newUser);
  writeUsers(filePath, users);

  res.status(201).send(`Добавлен юзер с именем ${newUser.name}`);
});

userRouter.patch("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const users = readUsers(filePath);
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    res.status(404).send("Такого юзера нет");
    return;
  }

  const newName = req.body?.name;

  if (typeof newName !== "string" || newName.trim() === "") {
    res.status(400).send("Поле name обязательно");
    return;
  }

  users[index].name = newName;
  writeUsers(filePath, users);

  res.json(users[index]);
});

userRouter.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const users = readUsers(filePath);
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    res.status(404).send("Такого юзера нет");
    return;
  }

  const [deletedUser] = users.splice(index, 1);
  writeUsers(filePath, users);

  res.json(deletedUser);
});
