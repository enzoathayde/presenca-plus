import { createNewEventRepository, deleteEventRepository, editEventRepository, getAllEventsRepository } from "../repository/eventRepository";
import { EventDTO } from "../dtos/EventDTO";


const getAllEventsService = async () => {
  try {
    const allEvents = await getAllEventsRepository();  

    return allEvents;
  } catch (error) {
    throw new Error("Events not found") 
  }  
}

const createNewEventService = async (event: EventDTO) => {
  try {
     const newEvent = await createNewEventRepository(event);

     return newEvent;
  } catch (error) {
     throw new Error("Failed to create a new Event")
  }
}

const editEventService = async (EventId: string, Event: EventDTO) => {
  try {
    const editedEvent = await editEventRepository(EventId, Event);

    return editedEvent;
  } catch (error) {
    throw new Error("Failed to edit Event")
  }
}


const deleteEventService = async (EventId: string) => {
  try {
    const editedEvent = await deleteEventRepository(EventId);

    return editedEvent;
  } catch (error) {
    throw new Error("Failed to edit Event")
  }
}





export { getAllEventsService, createNewEventService, editEventService, deleteEventService }