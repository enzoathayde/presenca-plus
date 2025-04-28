import express, { Express, Router } from "express";
import createAttendanceController from "../controllers/attendanceController";

const attendanceRouter = express.Router()

attendanceRouter.post('/attendance/createNew', createAttendanceController)

export default attendanceRouter;

