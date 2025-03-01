import { db } from "@database/connection";
import { Product, Role, User } from "@database/schema";
import UserRepository from "@users/users.repository";
import { ApplicationError } from "@utils/ApplicationError";
import generateUniqueSlug from "@utils/generateSlug";
import { ProductSchema } from "@utils/validation";
import { eq } from "drizzle-orm";
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
            const expiryDate = data.scheduledStartDate;
            expiryDate.setDate(expiryDate.getDate()+7);

            // Generate Slug from product name
            const slug = await generateUniqueSlug(data.name);
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
    
}

export default ProductRepository;