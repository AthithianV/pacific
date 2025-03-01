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