import { db } from "@database/connection";
import { Product, Role, User } from "@database/schema";
import UserRepository from "@users/users.repository";
import { ApplicationError } from "@utils/ApplicationError";
import { calculateDiscount } from "@utils/calculateDiscount";
import generateUniqueSlug from "@utils/generateSlug";
import { ProductSchema } from "@utils/validation";
import { and, eq, like, or, sql } from "drizzle-orm";
import { z } from "zod";


class ProductRepository{

    addProduct = async (data:z.infer<typeof ProductSchema>, addedBy: number) => {
        try {

            // Validate the Vendor ID
            const vendorExists = await db
              .select({role: Role.name})
              .from(User)
              .where(eq(User.id, data.vendorId))
              .innerJoin(Role, eq(User.roleId, Role.id));
            if(vendorExists.length===0 || vendorExists[0].role !== "VENDOR"){
                throw new ApplicationError(400, "Vendor does not Exists, check vendor ID")
            }

            // Find the expiry date which is 7 days from start date.
            const expiryDate = new Date(data.scheduledStartDate);
            expiryDate.setDate(expiryDate.getDate()+7);

         
            

            // Generate Slug from product name
            const slug = await generateUniqueSlug(data.name);
            console.log({
                ...data,
                urlSlug: slug,
                expiryDate,
                deliveryAmount: data.deliveryAmount.toString(),
                oldPrice: data.oldPrice.toString(),
                newPrice: data.newPrice.toString(),
                addedBy
            });

            // Insert Product to Table
            const result = await db.insert(Product).values({
                ...data,
                urlSlug: slug,
                expiryDate,
                deliveryAmount: data.deliveryAmount.toString(),
                oldPrice: data.oldPrice.toString(),
                newPrice: data.newPrice.toString(),
                addedBy
            });

            // Get added Product from database
            const newProduct = await db.select().from(Product).where(eq(Product.id, result[0].insertId));
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    getAllProducts = async (page:number, limit:number, userId:number)=>{

        const user = await UserRepository.getUserById(userId);

        /**  Check if request user role === USER, then we need
        * - Vendor Information
        * - Expiry Time
        * - Discout Percentage
        * 
        * If request User role === VENDOR, we need to return on the vendors's Product else we return all produt
        */
        if(user.role === "USER"){
            const products = await db
                .select()
                .from(Product)
                .innerJoin(User, eq(User.id, Product.vendorId))
                .limit(limit)
                .offset((page-1)*limit);

            const formattedProducts = products.map(({ users, products }) => ({
                ...products,
                vendor: {email: users.email, username: users.username},
                discountAmount: calculateDiscount(
                    Number(products.oldPrice), 
                    Number(products.newPrice)).discountAmount,
                discountPercentage: calculateDiscount(
                    Number(products.oldPrice),
                    Number(products.newPrice)).discountPercentage
            }));
            return formattedProducts;
        }
        
        const products = await db
            .select()
            .from(Product)
            .where(user.role === "VENDOR"?eq(Product.vendorId, userId):undefined)
            .limit(limit)
            .offset((page-1)*limit);

        return products;
    }

    getProductBySlug = async (slug:string, userId:number)=>{
        const user = await UserRepository.getUserById(userId);

        /**  Check if request user role === USER, then we need
        * - Vendor Information
        * - Expiry Time
        * - Discout Percentage
        * 
        * If request User role === VENDOR, we need to return on the vendors's Product else we return all produt
        */
        if(user.role === "USER"){
            const productRecord = await db
                .select()
                .from(Product)
                .where(eq(Product.urlSlug, slug))
                .innerJoin(User, eq(User.id, Product.vendorId));
            
            if(productRecord.length===0) return {};

            const {users, products} = productRecord[0];
            return {
                ...products, 
                vendor: {email: users.email, username: users.username},
                discountAmount: calculateDiscount(
                    Number(products.oldPrice), 
                    Number(products.newPrice)).discountAmount,
                discountPercentage: calculateDiscount(
                    Number(products.oldPrice),
                    Number(products.newPrice)).discountPercentage
            };
        }
        
        const product = await db
            .select()
            .from(Product)
            .where(user.role === "VENDOR"?eq(Product.vendorId, userId):undefined)

        return product.length==0?{}:product[0];
    }

    searchProduct = async (page:number, limit:number, userId:number, keyword:string)=>{

        const user = await UserRepository.getUserById(userId);

        if(!limit) limit = 20;
        if(!page) page = 1;

        const pattern = `%${keyword}%`
        const condition = or(like(Product.name, pattern), like(Product.description, pattern));

        const products = await db
            .select()
            .from(Product)
            .where(condition)
            .innerJoin(User, eq(User.id, Product.vendorId))
            .limit(limit)
            .offset((page-1)*limit);

        const formattedProducts = products.map(({ users, products }) => ({
            ...products,
            vendor: {email: users.email, username: users.username},
            discountAmount: calculateDiscount(
                Number(products.oldPrice), 
                Number(products.newPrice)).discountAmount,
            discountPercentage: calculateDiscount(
                Number(products.oldPrice),
                Number(products.newPrice)).discountPercentage
        }));
        return formattedProducts;
    
    }
    
}

export default ProductRepository;