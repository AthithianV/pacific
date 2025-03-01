import express from "express";
import UserController from "./users.controller";
import auth from "middlewares/auth";
import adminAuth from "middlewares/adminAuth";

const UserRouter = express.Router();
const userController = new UserController();

UserRouter.post("/signup", userController.signUp);
UserRouter.post("/login", userController.login);
UserRouter.post("/create-staff", auth, adminAuth, userController.createStaff);
UserRouter.get("/all-users", auth, adminAuth, userController.getUsers);
UserRouter.get("/:userId", auth, adminAuth, userController.getUserById);

export default UserRouter;