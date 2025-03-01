import { z } from "zod";


export const userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long."
    ),
    role: z.enum(["ADMIN", "STAFF", "VENDOR", "USER"])
});

export const ProductSchema = z.object({
  vendorId: z.number().int().positive().describe("Vendor ID is required"),
  name: z.string().max(100, "Name must be at most 100 characters").min(1, "Name is required"),
  description: z.string().max(500, "Description must be at most 500 characters").optional().nullable(),
  category: z.string().max(50, "Category must be at most 50 characters").min(1, "Category is required"),
  scheduledStartDate: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Scheduled Start Date must be a valid date",
  }),
  freeDelivery: z.boolean().default(false),
  deliveryAmount: z.coerce.number().min(0, "Delivery Amount must be a positive number"),
  oldPrice: z.coerce.number().min(0, "Old Price must be a positive number"),
  newPrice: z.coerce.number().min(0, "New Price must be a positive number"),
});