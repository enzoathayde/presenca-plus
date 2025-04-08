// src/controllers/notificationController.ts
import { Request, Response } from 'express';

export const sendNotificationHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Sua lógica de notificação
  return res.status(200).json({ message: 'Notificação enviada!' });
};
