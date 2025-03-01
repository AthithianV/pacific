import { eq, or } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { z } from "zod";

import { Role, User } from "@database/schema";
import { ApplicationError } from "@utils/ApplicationError";
import { db } from "database/connection";
import { userSchema } from "@utils/validation";


class UserRepository{

    signup = async (data:z.infer<typeof userSchema>) => {
        try {

            // Get role id of role in request data, if role name does not exists throw Application error.
            const roleRecord = await db.select({id:Role.id}).from(Role).where(eq(Role.name, data.role)).limit(1);
            if(roleRecord.length===0){
                throw new ApplicationError(400, `Role with name:${data.role} Does not Exists`);
            }

            // Check if username and email already exists, if yes throw application error.
            const existsingUser = 
              await db
                .select({ username: User.username, email: User.email })
                .from(User)
                .where(
                    or(
                        eq(User.email, data.email),
                        eq(User.email, data.email)
                    )
                )
            if(existsingUser.length>0){
                throw new ApplicationError(400, `${data.username===existsingUser[0].username?"Username":"Email"} already Taken`);
            }

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
                    roleId: roleRecord[0].id
                }
            );

        } catch (error) {
            throw error;
        }
    }
    
}

export default UserRepository;