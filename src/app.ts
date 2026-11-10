import express, { type Express } from "express";
import connectDB from "./utils/connectDB.ts";
import { logger } from "./middlewares/logger.ts";
import { staticMiddleware } from "./middlewares/static.ts";
import { userRouter } from "./routers/user.router.ts";
import { orderRouter } from "./routers/order.router.ts";
import { productRouter } from "./routers/product.router.ts";
import swaggerUi from "swagger-ui-express";
import { openapiSpecification } from "./utils/swagger.ts";

const app: Express = express();
const PORT = 3000;
connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(logger);
app.use(express.json());
app.use(staticMiddleware);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
