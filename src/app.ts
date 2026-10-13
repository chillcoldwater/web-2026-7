import express, { type Express } from "express";
import { logger } from "./middlewares/logger.ts";
import { staticMiddleware } from "./middlewares/static.ts";
import { userRouter } from "./routers/user.router.ts";

const app: Express = express();
const PORT = 3000;
app.use(logger);
app.use(express.json());
app.use(staticMiddleware);
app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
