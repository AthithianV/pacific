import express from "express";
import ProductController from "./products.controller";

const ProductRouter = express.Router();
const productController = new ProductController();

ProductRouter.post("/add-product", productController.addProduct);
ProductRouter.get("/get-all-products", productController.getAllProducts);
ProductRouter.get("/get-product/:slug", productController.getProductBySlug);
ProductRouter.get("/search-product", productController.searchProduct);

export default ProductRouter;