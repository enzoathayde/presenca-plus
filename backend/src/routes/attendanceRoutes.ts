import express, { Express, Router } from "express";
import { createAttendanceController, findAttendancesByUser } from "../controllers/attendanceController";

const attendanceRouter = express.Router()
/**
 * @swagger
 * /attendance/createNew:
 *   post:
 *     summary: Registra a presença de um usuário em um evento com base na localização
 *     description: Valida se o usuário está dentro de um raio de 50 metros do local do evento antes de registrar a presença.
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - eventId
 *               - location
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *               eventId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6a7b8c9d0e2"
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: -23.5502
 *                   lng:
 *                     type: number
 *                     example: -46.6332
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-05T14:48:00Z"
 *     responses:
 *       201:
 *         description: Presença registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *                 checkInTime:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Usuário fora da distância permitida ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: Registro duplicado de presença
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
attendanceRouter.post('/attendance/createNew', createAttendanceController)

/**
 * @swagger
 * /attendance/user:
 *   get:
 *     summary: Retorna todas as presenças registradas de um usuário
 *     description: Busca todas as presenças associadas a um determinado userId.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para buscar as presenças
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Lista de presenças retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   eventId:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                   checkInTime:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro ao buscar as presenças
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
attendanceRouter.get('/attendance/findByUserId', findAttendancesByUser)

export default attendanceRouter;

