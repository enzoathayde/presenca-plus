import express, { Express, Router } from "express";
import { createAttendanceController, findAttendancesByUser } from "../controllers/attendanceController";

const attendanceRouter = express.Router()

attendanceRouter.post('/attendance/createNew', createAttendanceController)
attendanceRouter.get('/attendance/findByUserId', findAttendancesByUser)

export default attendanceRouter;

