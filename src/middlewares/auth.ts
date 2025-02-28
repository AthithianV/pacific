import { ApplicationError } from "@utils/ApplicationError";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let token = req.headers["authorization"];
        if(!token || !token.startsWith("Bearer ")){
            throw new ApplicationError(403, "Unauthorized");
        }

        token = token.split(" ")[1];

        if(!process.env.SECRET_KEY){
            throw new Error("SECRET KEY NOT SET IN ENVROMENT VARIABLES");
        }

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload as {id:number, username: string, email:string, role:"ADMIN"|"VENDOR"|"USER"|"STAFF"};

        next();
    } catch (error) {
        next(error);
    }
}

export default auth;