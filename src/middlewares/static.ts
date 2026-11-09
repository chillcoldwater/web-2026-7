import express from "express";
import path from "path";

export const staticMiddleware = express.static(
  path.join(process.cwd(), "src", "static")
);