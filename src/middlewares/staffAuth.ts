import { ApplicationError } from "@utils/ApplicationError";
import logger from "@utils/logger";
import type { NextFunction, Request, Response } from "express";

const adminAuth = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        if(req.user && req.user.role!=="ADMIN" && req.user.role!=="STAFF"){
            logger.warn(`Forbibben action by ${req.user?.email}`);
            throw new ApplicationError(403, "Forbbiden, Only staff/Admin can Perform the Action");
        }        
        next();
    } catch (error) {
        next(error);
    }
}

export default adminAuth;