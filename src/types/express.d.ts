import { Express } from "express";

declare global{
    namespace Express {
        interface Request {
            user?: {
                id: number,
                username: string,
                email: string,
                role: "ADMIN" | "STAFF" | "VENDOR" | "USER"
            }
        }
    }
}

export {};