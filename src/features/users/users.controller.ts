import {Request, Response, NextFunction} from "express";
import UserRepository from "@users/users.repository";
import { ApplicationError } from "@utils/ApplicationError";
import { userSchema } from "@utils/validation";

class UserController{

    userRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }


    signUp = async (req:Request, res:Response, next:NextFunction) => {
        try {
            
            // Validate Request data.
            const result = userSchema.safeParse(req.body);
            if(!result.success){
                res.status(400).json({errro: result?.error.format(), message: "Invalid input(s)", success: false});
                return;
            }

            // Check if role is ADMIN or STAFF
            if(result.data.role === "ADMIN" || result.data.role === "STAFF"){
                throw new ApplicationError(400, `Cannot Sign up ${result.data.role}. Only VENDOR and USER can Sugn up themselves.`);
            }

            

            // Sign Up the user.
            await this.userRepository.signup(result.data);

            res.status(201).json({message: "User Signed up Successfully", success: true});

        } catch (error) {
            next(error);
        }
    }

    function = async (req:Request, res:Response, next:NextFunction) => {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    function1 = async (req:Request, res:Response, next:NextFunction) => {
        try {
            
        } catch (error) {
            next(error);
        }
    }
    
}

export default UserController;