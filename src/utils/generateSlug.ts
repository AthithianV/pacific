import { db } from "@database/connection";
import { Product } from "@database/schema";
import { eq } from "drizzle-orm";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};


// Generate Unique Slug from the product name
const generateUniqueSlug = async (name: string) => {
  let slug = generateSlug(name);
  let exists = await db.select().from(Product).where(eq(Product.urlSlug, slug));
  if (exists.length>0) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  return slug;
};


export default generateUniqueSlug;