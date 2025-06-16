import { Request, Response } from "express";
import { AttendanceDTO } from "../dtos/AttendanceDTO";
import AttendanceModel from "../models/Attendance";
import EventModel from "../models/Event";
import { log } from "console";
import Attendance from "../models/Attendance";
import User from "../models/User";
import { EventDTO } from "../dtos/EventDTO";

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const createAttendanceController = async (
  request: Request,
  response: Response
): Promise<any> => {
  const attendanceData: any = request.body;

  try {
    // Validação inicial dos dados
    if (!attendanceData.userId || !attendanceData.eventId) {
      return response.status(400).json({ 
        error: "Dados incompletos. userId e eventId são obrigatórios." 
      });
    }

    // Verifica se o usuário existe
    const userExist = await User.findById(attendanceData.userId);
    if (!userExist) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    // Busca o evento
    let event;
    if (attendanceData.checkInMethod === 'qr' && attendanceData.qrCode) {
      event = await EventModel.findOne({ qrCodeData: attendanceData.qrCode });
      if (!event) {
        return response.status(404).json({ error: "Evento não encontrado para o QR code fornecido" });
      }
      if (event._id.toString() !== attendanceData.eventId) {
        return response.status(400).json({ error: "QR code não corresponde ao evento" });
      }
    } else {
      event = await EventModel.findById(attendanceData.eventId);
      if (!event) {
        return response.status(404).json({ error: "Evento não encontrado" });
      }
    }

    // Verifica se o usuário já está registrado no evento
    const alreadyRegistered = event.attendees.some(
      (attendee: any) => attendee.userId.toString() === attendanceData.userId
    );
    if (alreadyRegistered) {
      return response.status(400).json({ error: "Usuário já registrado neste evento" });
    }

    // Validação de distância para check-in manual
    if (attendanceData.checkInMethod === 'manual') {
      const eventLat = event.location.coordinates.lat;
      const eventLng = event.location.coordinates.lng;
      const userLat = attendanceData.location.lat;
      const userLng = attendanceData.location.long;
      
      const distanceInKm = calculateDistance(eventLat, eventLng, userLat, userLng);
      const distanceInMeters = distanceInKm * 1000;
      const maxAllowedDistance = 50;

      if (distanceInMeters > maxAllowedDistance) {
        return response.status(400).json({
          error: `Você está muito longe do local do evento. Distância: ${distanceInMeters.toFixed(2)} metros`
        });
      }
    }

    // Cria a attendance
    const newAttendance = await AttendanceModel.create({
      ...attendanceData,
      checkInTime: attendanceData.checkInTime || new Date()
    });

    // Adiciona o usuário aos participantes do evento
    event.attendees.push({
      userId: attendanceData.userId,
      status: "registered"
    } as any);
    await event.save();

    return response.status(201).json(newAttendance);

  } catch (error: any) {
    console.error("Erro ao criar presença:", error);
    return response.status(500).json({ 
      error: "Erro interno do servidor",
      details: error.message 
    });
  }
};

const findAttendancesByUser = async (
  request: Request,
  response: Response
): Promise<any> => {
  const user: any = request.query.id;

  try {
    const attendancesResponse: any = await Attendance.find({ userId: user });
    return response.status(200).json(attendancesResponse);
  } catch (error) {
    return response.status(500).json({ error: "Falha ao buscar presenças" });
  }
};

export { findAttendancesByUser, createAttendanceController };
