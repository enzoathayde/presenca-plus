import express, { Express, Router } from "express";
import { getAllUsersController, createNewUserController, editUserController, deleteUserController} from "../controllers/userController";



const userRouter = express.Router()

userRouter.get("/users/getAll", getAllUsersController)
userRouter.post("/users/createNew", createNewUserController)
userRouter.put("/users/:id", editUserController)
userRouter.delete("/users/:id", deleteUserController)


export default userRouter;
