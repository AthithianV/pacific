import { ApplicationError } from "@utils/ApplicationError";
import logger from "@utils/logger";
import type { NextFunction, Request, Response } from "express";

const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof ApplicationError){
        res.status(err.statusCode).json({success: false, message: err.message});
        return;
    }

    logger.error("Unexpected Error: ", err);
    res.status(500).json({success: false, message: "Internal Server Error"});
}

export default errorHandler;