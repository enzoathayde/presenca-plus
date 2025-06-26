import mongoose, { Schema } from "mongoose";
import { AttendanceDTO } from "../dtos/AttendanceDTO";

const attendanceSchema: Schema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", 
      required: [true, "O ID do evento é obrigatório"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "O ID do usuário é obrigatório"],
    },
    imageCheckIn: {
      type: String,
      required: [true, "A imagem de check-in é obrigatório"],
    },
    checkInTime: {
      type: Date,
      default: Date.now, 
      required: [true, "O horário do check-in é obrigatório"],
    },
    location: {
      lat: {
        type: Number,
        required: [true, "A latitude é obrigatória"],
      },
      long: {
        type: Number,
        required: [true, "A longitude é obrigatória"],
      },
    },
    deviceInfo: {
      brand: {
        type: String,
      },
      modelName: {
        type: String,
      },
      osName: {
        type: String,
        required: [true, "O nome do sistema operacional é obrigatório"],
      },
      osVersion: {
        type: String,
        required: [true, "A versão do sistema operacional é obrigatória"],
      },
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<AttendanceDTO>("Attendance", attendanceSchema, "attendances");