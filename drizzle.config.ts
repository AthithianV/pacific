import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

const DATABASE_HOST=process.env.DATABASE_HOST as string;
const DATABASE_PORT=Number(process.env.DATABASE_PORT);
const DATABASE_NAME=process.env.DATABASE_NAME as string;
const DATABASE_USER=process.env.DATABASE_USER as string;
const DATABASE_PASS=process.env.DATABASE_PASS as string;
 
export default defineConfig({
    dialect: "mysql",
    schema: "./src/database/schema.ts",
    out: "./migrations",
    dbCredentials: {
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        database: DATABASE_NAME, 
        user: DATABASE_USER,
        password: DATABASE_PASS,
    }
});