import express, { type Request, type Response } from "express";
import { Order } from "../models/Order.ts";
import { Product } from "../models/Product.ts";
import { User } from "../models/User.ts";
import { requireAuth } from "../middlewares/auth.ts";

export const orderRouter = express.Router();

orderRouter.use(requireAuth);

/**
 * @openapi
 * /orders/:
 *   get:
 *     summary: Получить все заказы
 *     description: Возвращает список всех заказов вместе с данными пользователя и товара.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderPopulated'
 *       401:
 *         description: Не авторизован.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
orderRouter.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("product", "title price");

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Получить заказ по id
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID заказа
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Заказ найден.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderPopulated'
 *       400:
 *         description: Некорректный id.
 *       404:
 *         description: Заказ не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
orderRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("product", "title price");

    if (!order) {
      res.status(404).json({
        message: "Заказ с таким id не был найден",
        id,
      });
      return;
    }

    res.status(200).json(order);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /orders/:
 *   post:
 *     summary: Создать заказ
 *     description: Создаёт заказ и рассчитывает его стоимость в копейках на основе цены товара.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Заказ создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Создан заказ на сумму 199800 копеек
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Некорректные данные заказа.
 *       401:
 *         description: Не авторизован.
 *       404:
 *         description: Пользователь или товар не найдены.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
orderRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "Пользователь с таким id не найден",
        userId,
      });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        message: "Товар с таким id не найден",
        productId,
      });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({
        message: "Количество товара должно быть не меньше 1",
      });
      return;
    }

    const totalPrice = product.price * quantity;

    const newOrder = await Order.create({
      user: userId,
      product: productId,
      quantity,
      totalPrice,
    });

    res.status(201).json({
      message: `Создан заказ на сумму ${totalPrice} копеек`,
      order: newOrder,
    });
  } catch (error: any) {
    console.error(error);

    if (error?.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );

      res.status(400).json({
        message: "Ошибка валидации данных",
        errors: messages,
      });
      return;
    }

    if (error?.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
      return;
    }

    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /orders/{id}:
 *   patch:
 *     summary: Обновить статус заказа
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID заказа
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *     responses:
 *       200:
 *         description: Заказ обновлён.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заказ с id=65f1a2b3c4d5e6f7a8b9c0d1 был обновлён
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Некорректный id или статус заказа.
 *       404:
 *         description: Заказ не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
orderRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const editedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    if (!editedOrder) {
      res.status(404).json({
        message: "Заказ с данным id не найден",
        id,
      });
      return;
    }

    res.status(200).json({
      message: `Заказ с id=${editedOrder._id} был обновлён`,
      order: editedOrder,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
      return;
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );

      res.status(400).json({
        message: "Ошибка валидации данных",
        errors: messages,
      });
      return;
    }

    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     summary: Удалить заказ
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID заказа
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Заказ удалён.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заказ удалён
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден.
 *       400:
 *         description: Некорректный id.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
orderRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      res.status(404).json({
        message: "Заказ с таким id не был найден",
        id,
      });
      return;
    }

    res.status(200).json({
      message: "Заказ удалён",
      order,
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Некорректный id!" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
