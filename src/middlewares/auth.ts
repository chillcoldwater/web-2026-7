import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { secret, type AuthJwtPayload } from "../controllers/auth.ts";
import { User } from "../models/User.ts";
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const match = /^Bearer (\S+)$/i.exec(req.get("Authorization") ?? "");
  if (!match) {
    res.status(401);
    res.send({ error: "Передайте правильный токен" });
    return;
  }
  try {
    const payload = jwt.verify(match[1], secret) as AuthJwtPayload;
    const user = await User.exists({ email: payload.email });
  } catch (error) {
    res.status(401).send({ message: error });
  }

  next();
}
