import express, { type Request, type Response } from "express";
import { Product } from "../models/Product.ts";

export const productRouter = express.Router();

/**
 * @openapi
 * /products/:
 *   get:
 *     summary: Получить все товары
 *     description: Возвращает список всех товаров из базы данных.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
productRouter.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден.
 *       400:
 *         description: Некорректный id или товар не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
productRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        message: "Товар с таким id не был найден",
        id,
      });
      return;
    }

    res.status(200).json(product);
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
 * /products/:
 *   post:
 *     summary: Создать товар
 *     tags:
 *       - Products
 *     responses:
 *       201:
 *         description: Товар создан.
 *       400:
 *         description: Ошибка валидации данных.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
productRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, price, stock } = req.body;
    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
    });

    res.status(201).json({
      message: `Добавлен товар "${newProduct.title}"`,
      product: newProduct,
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

    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Товар обновлён.
 *       400:
 *         description: Некорректный id или ошибка валидации.
 *       404:
 *         description: Товар не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
productRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock } = req.body;

    const editedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price, stock },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    if (!editedProduct) {
      res.status(404).json({
        message: "Товар с данным id не найден",
        id,
      });
      return;
    }

    res.status(200).json({
      message: `Товар с id=${editedProduct._id} был обновлён`,
      product: editedProduct,
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
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён.
 *       404:
 *         description: Товар не найден.
 *       400:
 *         description: Некорректный id.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
productRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        message: "Товар с таким id не был найден",
        id,
      });
      return;
    }

    res.status(200).json({
      message: "Товар удалён",
      product,
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
