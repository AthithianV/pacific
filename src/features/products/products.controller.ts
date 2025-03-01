import {Request, Response, NextFunction} from "express";
import Repository from "@users/users.repository";

class Controller{

    repository;
    constructor(){
        this.repository = new Repository();
    }


    function = async (req:Request, res:Response, next:NextFunction) => {
        try {
            
        } catch (error) {
            next(error);
        }
    }
    
}

export default Controller;