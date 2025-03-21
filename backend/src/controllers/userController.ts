import getAllUsersService from "../services/userServices";
import { Request, Response } from "express";

const getAllUsersController = async (request: Request, response: Response): Promise<any> => {
  try {
    const allUsers = await getAllUsersService();
    return response.status(200).json(allUsers);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
    throw new Error("[CONTROLLER] Error to fetch all users.")
  }
}

export default getAllUsersController;