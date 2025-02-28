import logger from "@utils/logger";
import type { NextFunction, Request, Response } from "express";

const logRequest = (req:Request, res:Response, next:NextFunction)=>{
    logger.info(`Request: [Method: ${req.method}], [URL: ${req.url}]`)
    next();
}

export default logRequest;