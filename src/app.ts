import express, { Express, Request, Response } from "express";
import cors from "cors";
import logRequest from "middlewares/logRequest";
import { ApplicationError } from "@utils/ApplicationError";
import errorHandler from "middlewares/errorHandler";
import UserRouter from "@users/users.routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/user", UserRouter);

// Handle wrong Url path
app.use((req:Request, res:Response)=>{
    throw new ApplicationError(404, "API not Found");
})

// Handle Error
app.use(errorHandler);


export default app;