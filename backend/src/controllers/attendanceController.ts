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
  const attendanceData: AttendanceDTO = request.body;

  console.log("Dados de presença recebidos:", attendanceData);

  if (!attendanceData.userId || !attendanceData.eventId) {
    return response.status(400).json({
      error: "Dados incompletos. userId e eventId são obrigatórios.",
    });
  }
  
  console.log('1');
  

  let event;

  event = await EventModel.findOne({ qrCodeData: attendanceData.qrCode });
  console.log('event :>> ', event);
  if (!event) {
    return response
      .status(404)
      .json({ error: "Evento não encontrado para o QR code fornecido" });
  }

    console.log('2');

  if (event._id.toString() !== attendanceData.eventId) {
    console.log('attendanceData.eventId :>> ', attendanceData.eventId);
    console.log('event._id.toString() :>> ', event._id.toString());
    return response
      .status(400)
      .json({ error: "QR code não corresponde ao evento" });
  } else {
    event = await EventModel.findById(attendanceData.eventId);
    if (!event) {
      return response.status(404).json({ error: "Evento não encontrado" });
    }
  }

    console.log('3');

  const alreadyRegistered = event.attendees.some(
    (attendee: any) => attendee.userId.toString() === attendanceData.userId
  );
  if (alreadyRegistered) {
    return response
      .status(400)
      .json({ error: "Usuário já registrado neste evento" });
  }

  console.log('4');
  

  const eventLat = event.location.coordinates.lat;
  const eventLng = event.location.coordinates.lng;
  const userLat = attendanceData.location.lat;
  const userLng = attendanceData.location.long;

  console.log('lat do evento', eventLat);
  console.log('lmg do evento', eventLng);
  console.log('lat do suario', userLat);
  console.log('lmg do suario', userLng);
  
  const distanceInKm = calculateDistance(eventLat, eventLng, userLat, userLng);
  const distanceInMeters = distanceInKm * 1000;
  const maxAllowedDistance = 150;

  if (distanceInMeters > maxAllowedDistance) {
    console.log('fpra de alcance');
    
    return response.status(400).json({
      error: `Você está muito longe do local do evento. Distância: ${distanceInMeters.toFixed(
        2
      )} metros.`,
    });
  }

    console.log('5');

  const newAttendance = await AttendanceModel.create({
    ...attendanceData,
    checkInTime: attendanceData.checkInTime || new Date(),
  });

  event.attendees.push({
    userId: attendanceData.userId,
    status: "registered",
  } as any);
  await event.save();

  return response.status(201).json(newAttendance);
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
