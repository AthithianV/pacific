import { ApplicationError } from "@utils/ApplicationError";
import type { NextFunction, Request, Response } from "express";

const adminAuth = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        if(req.user?.role!=="STAFF"){
            throw new ApplicationError(403, "Forbbiden, Only staff can Perform the Action");
        }        
        next();
    } catch (error) {
        next(error);
    }
}

export default adminAuth;