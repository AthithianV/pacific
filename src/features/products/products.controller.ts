import {Request, Response, NextFunction} from "express";
import { ProductSchema } from "@utils/validation";
import ProductRepository from "./products.repository";

class ProductController{

    productRepository;
    constructor(){
        this.productRepository = new ProductRepository();
    }


    addProduct = async (req:Request, res:Response, next:NextFunction) => {
        try {
           // Validate Request data.
            const result = ProductSchema.safeParse({...req.body});
            if(!result.success){
                res.status(400).json({errro: result?.error.format(), message: "Invalid input(s)", success: false});
                return;
            }

            if(req.user && req.user.role==="USER"){
                res.status(403).json({message: "Forbidden, User cannot add Product", success: false});
            }

            if(
                req.user &&
                req.user.role === "VENDOR" &&
                req.user.id !== result.data.vendorId
            ){
                res.status(403).json({message: "Forbidden, Vendors can only add their Product", success: false});
            }

            const addedProduct = await this.productRepository.addProduct({...result.data}, req.user?.id as number);
            res.status(201).json({success:true, message: "Product Added Successfully", addedProduct});
        } catch (error) {
            next(error);
        }
    }

    getAllProducts = async (req:Request, res:Response, next:NextFunction) => {
        try {
            let page = 1;
            let limit = 20;
            if(req.query.page) page = Number(req.query.page);
            if(req.query.limit) limit = Number(req.query.limit);

            const products = await this.productRepository.getAllProducts(page, limit, Number(req.user?.id));
            res.status(200).json({success:true, products});
        } catch (error) {
            next(error);
        }
    }

    getProductBySlug = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const {slug} = req.params;
            const product = await this.productRepository.getProductBySlug(slug, Number(req.user?.id));
            res.status(200).json({success:true, product});
        } catch (error) {
            next(error);
        }
    }

    searchProduct = async (req:Request, res:Response, next:NextFunction) => {
        try {
            let {keyword, page, limit} = req.query;
            const products = await this.productRepository.searchProduct(
                Number(page), 
                Number(limit), 
                Number(req.user?.id),
                keyword as string
            );
            res.status(200).json({success:true, products});
        } catch (error) {
            next(error);
        }
    }
    
}

export default ProductController;