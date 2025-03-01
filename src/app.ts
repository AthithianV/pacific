import express, { Express, Request, Response } from "express";
import cors from "cors";
import logRequest from "middlewares/logRequest";
import { ApplicationError } from "@utils/ApplicationError";
import errorHandler from "middlewares/errorHandler";
import UserRouter from "@users/users.routes";
import ProductRouter from "@products/products.routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcom To Pacific API");
});

app.use("/user", UserRouter);
app.use("/product", ProductRouter);

// Handle wrong Url path
app.use((req:Request, res:Response)=>{
    throw new ApplicationError(404, "API not Found");
})

// Handle Error
app.use(errorHandler);


export default app;