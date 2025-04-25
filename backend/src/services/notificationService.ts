import axios from 'axios';
import { getAccessToken, projectId } from '../config/firebase';
///coment
export async function sendNotification(fcmToken: string, title: string, body: string) {
  const token = await getAccessToken();

  const message = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body
      }
    }
  };

  const response = await axios.post(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    message,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}
