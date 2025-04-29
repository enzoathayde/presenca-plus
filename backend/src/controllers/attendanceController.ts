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

  console.log(attendanceData);

  try {
    if (attendanceData.checkInMethod === 'manual') {
      console.log("fluxo manual");
      
      const event: any = await EventModel.findById(attendanceData.eventId);
      const userExist = await User.findById(attendanceData.userId);

      if (!userExist) {
        return response.status(404).json({ error: "User not found" });
      }

      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      } else {
        let attendees = event.attendees;

        const alreadyRegistered = attendees.some(
          (attendee: any) =>
            attendee.userId.toString() === attendanceData.userId
        );

        if (alreadyRegistered) {
          return response
            .status(400)
            .json({ error: "User was attended on this event" });
        }

        event.attendees.push({
          userId: attendanceData.userId,
          status: "registered",
        });
        console.log(event.attendees);
        await event.save();
      }

      const eventLat = event.location.coordinates.lat;
      const eventLng = event.location.coordinates.lng;
      const userLat = attendanceData.location.lat;
      const userLng = attendanceData.location.long;
      const distanceInKm = calculateDistance(
        eventLat,
        eventLng,
        userLat,
        userLng
      );
      const distanceInMeters = distanceInKm * 1000;
      const maxAllowedDistance = 50;

      if (distanceInMeters > maxAllowedDistance) {
        return response.status(400).json({
          error: `You are too far from the event location. Distance: ${distanceInMeters.toFixed(
            2
          )} meters`,
        });
      }

      if (!attendanceData.checkInTime) {
        attendanceData.checkInTime = new Date();
      }

      const newAttendance = await AttendanceModel.create(attendanceData);
      return response.status(201).json(newAttendance);
    } else {    
      const event: any = await EventModel.findOne({
        qrCodeData: attendanceData.qrCode,
      });

      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      } else {
        let attendees = event.attendees;

        const alreadyRegistered = attendees.some(
          (attendee: any) =>
            attendee.userId.toString() === attendanceData.userId
        );

        if (alreadyRegistered) {
          return response
            .status(400)
            .json({ error: "User was attended on this event" });
        }
        event.attendees.push({
          userId: attendanceData.userId,
          status: "registered",
        });

        await event.save();
      }

      const newAttendance = await AttendanceModel.create(attendanceData);

      return response.status(201).json(newAttendance);
    }

  
  } catch (error: any) {
    console.error("Error creating attendance:", error);

    return response.status(500).json({ error: "Internal Server Error" });
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
    return response.status(500).json({ error: "Failed to fetch Users" });
  }
};
export { findAttendancesByUser, createAttendanceController };
