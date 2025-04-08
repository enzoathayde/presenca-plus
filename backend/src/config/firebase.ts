import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../../firebase-service-account.json');

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

const jwtClient = new JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key,
  SCOPES
);

export async function getAccessToken() {
  const { access_token } = await jwtClient.authorize();
  return access_token;
  
}

export const projectId = serviceAccount.project_id;
