import express from "express";
import UserController from "./users.controller";

const UserRouter = express.Router();
const userController = new UserController();

UserRouter.post("/signup", userController.signUp);

export default UserRouter;