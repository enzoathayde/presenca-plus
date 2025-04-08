import { Router } from 'express';
import { sendNotificationHandler } from '../controllers/notificationController';

const notificationRouter = Router(); 

notificationRouter.post('/send', sendNotificationHandler);

export default notificationRouter;
