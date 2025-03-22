import { EventDTO } from "../dtos/EventDTO";
import Event from "../models/Event";

const getAllEventsRepository = async () => {
   try {
    const allEvents = Event.find()

    return allEvents;
   } catch (error) {
    throw new Error("Error to find all Events in database")
   }
}

const createNewEventRepository = async (event: EventDTO) => {
   try {
      const newEvent = Event.create(event)
     

      return newEvent;
   } catch (error) {
      throw new Error("Failed to create a new Event")
   }
}

const editEventRepository = async (eventId: string, event: EventDTO) => {
   try {
      const editedEvent = Event.findByIdAndUpdate(eventId, event)

      return editedEvent;
   } catch (error) {
      throw new Error("Failed to update data from current Event")
   }
}

const deleteEventRepository = async (EventId: string) => {
   try {
      const editedEvent = Event.findByIdAndDelete(EventId)

      return editedEvent;
   } catch (error) {
      throw new Error("Failed to update data from current Event")
   }
}



export { getAllEventsRepository, createNewEventRepository, editEventRepository, deleteEventRepository }