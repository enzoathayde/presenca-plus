import { Request, Response } from "express";
import { AttendanceDTO } from "../dtos/AttendanceDTO";
import AttendanceModel from "../models/Attendance";
import EventModel from "../models/Event";
import { log } from "console";
import Attendance from "../models/Attendance";

// Função para calcular a distância usando a fórmula de Haversine
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const earthRadiusKm = 6371; // Raio médio da Terra em quilômetros

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c; // Distância em quilômetros
};

// Função auxiliar para converter graus em radianos
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const createAttendanceController = async (request: Request, response: Response): Promise<any> => {

  console.log("TENTANDO REGISTRAR PRESENÇA");
  

  try {
    const attendanceData: AttendanceDTO = request.body;

    // if (
    //   !attendanceData.eventId ||
    //   !attendanceData.userId ||
    //   !attendanceData.checkInMethod ||
    //   !attendanceData.location?.lat ||
    //   !attendanceData.location?.lng ||
    //   !attendanceData.deviceInfo?.osName ||
    //   !attendanceData.deviceInfo?.osVersion
    // ) {
      
    //   console.log("você está loucos");
      
    //   return response.status(400).json({ error: "Missing required fields" });
    // }

    // Busca o evento pelo ID para obter as coordenadas do local do evento
    const event = await EventModel.findById(attendanceData.eventId);
    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    const eventLat = event.location.coordinates.lat;
    const eventLng = event.location.coordinates.lng;

    const userLat = attendanceData.location.lat;
    const userLng = attendanceData.location.lng;

    const distanceInKm = calculateDistance(eventLat, eventLng, userLat, userLng);
    const distanceInMeters = distanceInKm * 1000; 
    const maxAllowedDistance = 50;

    if (distanceInMeters > maxAllowedDistance) {
      console.log("sim");
      

      return response.status(400).json({
        error: `You are too far from the event location. Distance: ${distanceInMeters.toFixed(
          2
        )} meters`,
      });
    }

    // Define o horário de check-in como o momento atual, se não for fornecido
    if (!attendanceData.checkInTime) {
      attendanceData.checkInTime = new Date();
    }

    // Cria um novo registro de presença no banco de dados
    const newAttendance = await AttendanceModel.create(attendanceData);

    // Retorna o registro criado com status 201 (Created)
    return response.status(201).json(newAttendance);
  } catch (error: any) {
    console.error("Error creating attendance:", error);

    // Trata erros específicos, como duplicação de registros
    if (error.code === 11000) {
      return response.status(409).json({ error: "Duplicate attendance record" });
    }

    // Retorna um erro genérico para outros tipos de falhas
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const findAttendancesByUser = async (request: Request, response: Response): Promise<any> => {

  const user: any = request.query.id;

  try {
    const attendancesResponse: any = await Attendance.find({ userId: user })

    return response.status(200).json(attendancesResponse);
  } catch (error) {
    return response.status(500).json({ error: "Failed to fetch Users"})
  }
  

  

  // console.log(attendancesResponse)


}
export { findAttendancesByUser, createAttendanceController };