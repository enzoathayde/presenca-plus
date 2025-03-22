import mongoose, { Schema } from "mongoose";
import { EventDTO } from "../dtos/EventDTO";

const eventSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      default: null, 
    },
    startDate: {
      type: Date,
      required: [true, "A data de início é obrigatória"],
    },
    endDate: {
      type: Date,
      required: [true, "A data de término é obrigatória"],
    },
    location: {
      name: {
        type: String,
        required: [true, "O nome do local é obrigatório"],
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, "A latitude é obrigatória"],
        },
        lng: {
          type: Number,
          required: [true, "A longitude é obrigatória"],
        },
      },
    },
    maxParticipants: {
      type: Number,
      required: [true, "O número máximo de participantes é obrigatório"],
      min: [1, "Deve haver pelo menos 1 participante"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "O criador do evento é obrigatório"],
    },
    type: {
      type: String,
      enum: ["class", "lecture", "workshop", "other"],  
      required: [true, "O tipo de evento é obrigatório"],
    },
    category: {
      type: String,
      required: [true, "A categoria do evento é obrigatória"],
    },
    qrCodeData: {
      type: String,
      default: null, 
    },
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        status: {
          type: String,
          enum: ["registered", "confirmed", "attended"],
          required: true,
        },
      },
    ],
    waitingList: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model<EventDTO>('Event', eventSchema, "events");