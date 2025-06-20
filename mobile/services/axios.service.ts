import axios from "axios";
import { API_URL } from "@env";

export const url = axios.create({baseURL: process.env.API_URL });