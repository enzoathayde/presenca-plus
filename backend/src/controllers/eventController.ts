import { EventDTO } from "../dtos/EventDTO";
import { Request, Response } from "express";
import { createNewEventService, deleteEventService, editEventService, getAllEventsService } from "../services/eventServices";


const getAllEventsController = async (_: Request, response: Response): Promise<any> => {
  try {
    const allEvents = await getAllEventsService();

    return response.status(200).json(allEvents);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
}

const createNewEventController = async (request: Request, response: Response): Promise<any> => {
  try {
    const newEventData: EventDTO = request.body;

    if (!newEventData.title) {
      return response.status(400).json({ error: "Missing required field: title" });
    }
    if (!newEventData.startDate || !isValidDate(newEventData.startDate)) {
      return response.status(400).json({ error: "Missing or invalid required field: startDate" });
    }
    if (!newEventData.endDate || !isValidDate(newEventData.endDate)) {
      return response.status(400).json({ error: "Missing or invalid required field: endDate" });
    }
    if (!newEventData.location || !newEventData.location.name) {
      return response.status(400).json({ error: "Missing required field: location.name" });
    }
    if (
      !newEventData.location.coordinates ||
      typeof newEventData.location.coordinates.lat !== "number" ||
      typeof newEventData.location.coordinates.lng !== "number"
    ) {
      return response.status(400).json({ error: "Missing or invalid required field: location.coordinates" });
    }
    if (!newEventData.maxParticipants || newEventData.maxParticipants <= 0) {
      return response.status(400).json({ error: "Missing or invalid required field: maxParticipants" });
    }
    if (!newEventData.createdBy) {
      return response.status(400).json({ error: "Missing required field: createdBy" });
    }
    if (!newEventData.type || !["class", "lecture", "workshop", "other"].includes(newEventData.type)) {
      return response.status(400).json({ error: "Missing or invalid required field: type" });
    }
    if (!newEventData.category) {
      return response.status(400).json({ error: "Missing required field: category" });
    }

    const newEvent = await createNewEventService(newEventData);

    return response.status(201).json(newEvent);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
}


const editEventController = async (request: Request, response: Response): Promise<any> => {
  try {

    const EventId = request.params.id;
    const editedEventData: EventDTO = request.body;

    if (!editedEventData.title) {
      return response.status(400).json({ error: "Missing required field: title" });
    }
    if (!editedEventData.startDate || !isValidDate(editedEventData.startDate)) {
      return response.status(400).json({ error: "Missing or invalid required field: startDate" });
    }
    if (!editedEventData.endDate || !isValidDate(editedEventData.endDate)) {
      return response.status(400).json({ error: "Missing or invalid required field: endDate" });
    }
    if (!editedEventData.location || !editedEventData.location.name) {
      return response.status(400).json({ error: "Missing required field: location.name" });
    }
    if (
      !editedEventData.location.coordinates ||
      typeof editedEventData.location.coordinates.lat !== "number" ||
      typeof editedEventData.location.coordinates.lng !== "number"
    ) {
      return response.status(400).json({ error: "Missing or invalid required field: location.coordinates" });
    }
    if (!editedEventData.maxParticipants || editedEventData.maxParticipants <= 0) {
      return response.status(400).json({ error: "Missing or invalid required field: maxParticipants" });
    }
    if (!editedEventData.createdBy) {
      return response.status(400).json({ error: "Missing required field: createdBy" });
    }
    if (!editedEventData.type || !["class", "lecture", "workshop", "other"].includes(editedEventData.type)) {
      return response.status(400).json({ error: "Missing or invalid required field: type" });
    }
    if (!editedEventData.category) {
      return response.status(400).json({ error: "Missing required field: category" });
    }


    const editedEvent = await editEventService(EventId,editedEventData);

    return response.status(201).json(editedEvent);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
  
}

const deleteEventController = async (request: Request, response: Response): Promise<any> => {
  try {

    const EventId = request.params.id;

    const deletedEvent = await deleteEventService(EventId);

    if(!deletedEvent) {
      return response.status(404).json({"error": "Event not found"})
    }

    return response.status(201).json(deletedEvent);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
  
}

function isValidDate(date: any): boolean {
  return date && new Date(date).toString() !== "Invalid Date";
}



export { getAllEventsController, createNewEventController, editEventController, deleteEventController}

