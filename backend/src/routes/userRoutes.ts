import express, { Express, Router } from "express";
import { getAllUsersController, createNewUserController, editUserController, deleteUserController} from "../controllers/userController";



const router = express.Router()

router.get("/users/getAll", getAllUsersController)
router.post("/users/createNew", createNewUserController)
router.put("/users/:id", editUserController)
router.delete("/users/:id", deleteUserController)


export default router;
