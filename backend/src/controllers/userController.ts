import { UserDTO } from "../dtos/UserDTO";
import {  getAllUsersService, createNewUserService, editUserService, deleteUserService } from "../services/userServices";

import { Request, Response } from "express";

const getAllUsersController = async (request: Request, response: Response): Promise<any> => {
  try {
    const allUsers = await getAllUsersService();
    return response.status(200).json(allUsers);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
}

const createNewUserController = async (request: Request, response: Response): Promise<any> => {
  try {
    const newUserData: UserDTO = request.body;

    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.registration) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const newUser = await createNewUserService(newUserData);

    return response.status(201).json(newUser);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
}


const editUserController = async (request: Request, response: Response): Promise<any> => {
  try {
        
    const userId = request.params.id;
    const editedUserData: UserDTO = request.body;

    if (!editedUserData.name || !editedUserData.email || !editedUserData.password || !editedUserData.registration) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const editedUser = await editUserService(userId,editedUserData);

    return response.status(201).json(editedUser);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
  
}

const deleteUserController = async (request: Request, response: Response): Promise<any> => {
  try {

    const userId = request.params.id;

    const deletedUser = await deleteUserService(userId);

    return response.status(201).json(deletedUser);
  } catch (error) {
    return response.status(500).json({error: "Internal Server Error"});
  }
  
}



export { getAllUsersController, createNewUserController, editUserController, deleteUserController };