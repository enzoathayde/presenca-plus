import axios from "axios";
import Constants from "expo-constants";
export const API_URL = Constants.expoConfig?.extra?.apiUrl;


export const url = axios.create({baseURL: API_URL});