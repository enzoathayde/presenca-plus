import express, { Express, Router } from "express";
import { createNewEventController, deleteEventController, editEventController, getAllEventsController } from "../controllers/eventController";

const eventRouter = express.Router()

eventRouter.get("/events/getAll", getAllEventsController)
eventRouter.post("/events/createNew", createNewEventController)
eventRouter.put("/events/:id", editEventController)
eventRouter.delete("/events/:id", deleteEventController)



export default eventRouter;
