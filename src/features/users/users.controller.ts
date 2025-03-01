import {Request, Response, NextFunction} from "express";
import UserRepository from "@users/users.repository";
import { ApplicationError } from "@utils/ApplicationError";
import { userSchema } from "@utils/validation";

class UserController{

    userRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }


    signUp = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
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

    login = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            // Extract Username and Password, validate them.
            const {username, password} = req.body;
            if(!username || !password){
                throw new ApplicationError(400, "Username and Password Required");
            }

            // Get token
            const token = await this.userRepository.login(username, password);
            res.status(200).json(
                {
                    message: "Login Successfully", 
                    success: true,
                    token
                }); 
        } catch (error) {
            next(error);
        }
    }

    createStaff = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            // Validate Request data.
            const result = userSchema.safeParse({...req.body, role: "STAFF"});
            if(!result.success){
                res.status(400).json({errro: result?.error.format(), message: "Invalid input(s)", success: false});
                return;
            }

            await this.userRepository.createStaff(result.data);

            res.status(201).json({message: "Staff Account created Successfully", success: true});
            
        } catch (error) {
            next(error);
        }
    }

    getUsers = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {

            // Get Page and Limit from query, if not exists in param set default value.
            let page = 1;
            let size = 20;
            if(req.query.page) page = Number(req.query.page);
            if(req.query.limit) size = Number(req.query.limit);

            const users = await this.userRepository.getUsers(page, size);

            res.status(200).json({users, success: true});
            
        } catch (error) {
            next(error);
        }
    }

    getUserById = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {

            const {userId} = req.params;

            const users = await UserRepository.getUserById(Number(userId));

            res.status(200).json({users, success: true});
            
        } catch (error) {
            next(error);
        }
    }
    
}

export default UserController;