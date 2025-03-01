import { eq, InferSelectModel, or } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { Role, User } from "@database/schema";
import { ApplicationError } from "@utils/ApplicationError";
import { db } from "database/connection";
import { userSchema } from "@utils/validation";

class UserRepository{

    static checkExisting = async (username:string, email:string)=>{
        // Check if username and email already exists, if yes throw application error.
        const existsingUser = 
            await db
            .select({ username: User.username, email: User.email })
            .from(User)
            .where(
                or(
                    eq(User.email, email),
                    eq(User.username, username)
                )
            )
        if(existsingUser.length>0){
            throw new ApplicationError(400, `${username===existsingUser[0].username?"Username":"Email"} already Taken`);
        }
    }

    static getRoleId = async (role:RoleOption)=>{
        const roleRecord = await db.select({id:Role.id}).from(Role).where(eq(Role.name, role)).limit(1);
        if(roleRecord.length===0){
            throw new ApplicationError(400, `Role with name:${role} Does not Exists`);
        }
        return roleRecord[0].id;
    }

    static getUserById = async (userId:number)=>{
        const userRecord = await db.select(
            {
                username: User.username,
                email: User.email,
                role: Role.name,
                created_at: User.createdAt,
                updated_at: User.updatedAt
            })
            .from(User)
            .where(eq(User.id, userId))
            .innerJoin(Role, eq(User.roleId, Role.id));
        
        if(userRecord.length===0){
            throw new ApplicationError(400, "User does not Exists, Check User ID");
        }

        return userRecord[0];
    }

    signup = async (data:z.infer<typeof userSchema>):Promise<void> => {
        try {

            // Get role id of role in request data, if role name does not exists throw Application error.
            const roleId = await UserRepository.getRoleId(data.role);

            await UserRepository.checkExisting(data.username, data.password);

            // Hash password
            const hashedPassword = await bcryptjs.hash(data.password,12);

            // Insert data
            await db
              .insert(User)
              .values(
                {
                    username: data.username, 
                    email: data.email, 
                    password: hashedPassword,
                    roleId
                }
            );

        } catch (error) {
            throw error;
        }
    }

    login = async (username:string, password:string):Promise<string>=>{

        // Get User record.
        const userRecord = 
            await db
            .select({
                id: User.id,
                username: User.username,
                email: User.email,
                password: User.password,
                role: Role.name
            })
            .from(User)
            .where(eq(User.username, username))
            .innerJoin(Role, eq(Role.id, User.roleId));
        if(userRecord.length===0){
            throw new ApplicationError(400, `Invalid Username or Password`);
        }

        // CHeck Passowrd
        const checkPassword = await bcryptjs.compare(password, userRecord[0].password);
        if(!checkPassword){
            throw new ApplicationError(400, `Incorrect Password`);
        }

        // Get SECRET KEY and Check if it exists
        const SECRET_KEY = process.env.SECRET_KEY;
        if(!SECRET_KEY){
            throw new Error("SECRET KEY is not added to ENV")
        }

        // Create Token
        const token = jwt.sign(
            {
                id: userRecord[0].id,
                username: userRecord[0].username,
                email: userRecord[0].email,
                role: userRecord[0].role,
            },
            SECRET_KEY,
            {expiresIn: "10h"}
        )

        return token;
    }

    createStaff = async (data:z.infer<typeof userSchema>):Promise<void>=>{

        const {username, password, email, role} = data;

        // Check if username and email already taken.
        await UserRepository.checkExisting(username, email);

        // Get role ID
        const roleId = await UserRepository.getRoleId(role);

        // Hash password
        const hashedPassword = await bcryptjs.hash(password,12);

        // Create staff
        await db.insert(User).values({username, email, roleId, password: hashedPassword});

    }
    getUsers = async (page:number = 1, size:number = 20)=>{
        // Create staff
        const userRecords = 
          await db.select(
            {
                username: User.username,
                email: User.email,
                role: Role.name,
                created_at: User.createdAt,
                updated_at: User.updatedAt
            })
            .from(User)
            .innerJoin(Role, eq(User.roleId, Role.id))
            .limit(size).offset((page-1)*size);

        return userRecords;
    }
    
}

export default UserRepository;