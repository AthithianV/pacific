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
            res.status(200).json({success:true, message: "Product Added Successfully", addedProduct});
        } catch (error) {
            next(error);
        }
    }

    function = async (req:Request, res:Response, next:NextFunction) => {
        try {
            
        } catch (error) {
            next(error);
        }
    }
    
}

export default ProductController;