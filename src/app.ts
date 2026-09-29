import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

interface User {
  id: number;
  name: string;
}

const filePath = path.join(process.cwd(), "users_db.txt");
const app: Express = express();
const PORT = 3000;

function readUsers(filePath: string): User[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8");
  }
  const data = fs.readFileSync(filePath, "utf8");
  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [id, name] = line.split(":");
      return { id: Number(id), name };
    });
}

function writeUsers(filePath: string, users: User[]): void {
  const content = users.map((u) => `${u.id}:${u.name}`).join("\n");
  fs.writeFileSync(filePath, content, "utf8");
}

function findUser(filePath: string, userId: number): User | undefined {
  return readUsers(filePath).find((x) => x.id === userId);
}

app.use(express.json());

app.get("/user/:id", (req: Request, res: Response) => {
  const user = findUser(filePath, Number(req.params.id));
  if (!user) {
    res.status(404).send("Такого юзера нет");
    return;
  }
  res.json(user);
});

app.post("/user/:id", (req: Request, res: Response) => {
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

app.patch("/user/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const users = readUsers(filePath);
  const index = users.findIndex((u) => u.id === id);

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

app.delete("/user/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const users = readUsers(filePath);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.status(404).send("Такого юзера нет");
    return;
  }

  const [deleted] = users.splice(index, 1);
  writeUsers(filePath, users);

  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});