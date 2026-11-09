import fs from "fs";
import path from "path";

export interface User {
  id: number;
  name: string;
}

export const filePath = path.join(process.cwd(), "users_db.txt");

export function readUsers(filePath: string): User[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8");
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [id, name] = line.split(":");
      return { id: Number(id), name };
    });
}

export function writeUsers(filePath: string, users: User[]): void {
  const content = users.map((user) => `${user.id}:${user.name}`).join("\n");
  fs.writeFileSync(filePath, content, "utf8");
}

export function findUser(filePath: string, userId: number): User | undefined {
  return readUsers(filePath).find((user) => user.id === userId);
}
