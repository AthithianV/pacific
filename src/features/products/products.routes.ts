import express from "express";
import ProductController from "./products.controller";

const ProductRouter = express.Router();
const productController = new ProductController();

ProductRouter.post("/add-product", productController.addProduct);

export default ProductRouter;