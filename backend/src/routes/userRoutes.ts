import express, { Express, Router } from "express";
import getAllUsersController from "../controllers/userController";


const router = express.Router()

router.get("/users/getAll", getAllUsersController )


export default router;
