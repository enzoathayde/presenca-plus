import express, { Express, Router } from "express";
import { createNewEventController, deleteEventController, editEventController, getAllEventsController, getEventByIdController } from "../controllers/eventController";

const eventRouter = express.Router()


/**
 * @swagger
 * /api/events/getAll:
 *   get:
 *     summary: Retorna todos os usuários cadastrados 
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos.
 *       500:
 *         description: Erro interno do servidor.
 */
eventRouter.get("/events/getAll", getAllEventsController)

/**
 * @swagger
 * /api/events/createNew:
 *   post:
 *     summary: Cria um novo evento.
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Workshop de UX/UI para principiantes"
 *               description:
 *                 type: string
 *                 example: "Um workshop prático sobre como desenvolver aplicativos móveis usando React Native e Firebase."
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-10T12:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-10T20:00:00.000Z"
 *               location:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Laboratório de Informática Fagammon"
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         example: -23.551
 *                       lng:
 *                         type: number
 *                         example: -46.634
 *               maxParticipants:
 *                 type: integer
 *                 example: 30
 *               createdBy:
 *                 type: string
 *                 example: "653b8f9c9d4e7a1f4c8b4568"
 *               type:
 *                 type: string
 *                 enum: [class, lecture, workshop, other]
 *                 example: "workshop"
 *               category:
 *                 type: string
 *                 example: "tecnologia"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67f46194b66669802e62f7c9"
 *                 title:
 *                   type: string
 *                   example: "Workshop de UX/UI para principiantes"
 *                 description:
 *                   type: string
 *                   example: "Um workshop prático sobre como desenvolver aplicativos móveis usando React Native e Firebase."
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T12:00:00.000Z"
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T20:00:00.000Z"
 *                 location:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Laboratório de Informática Fagammon"
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: -23.551
 *                         lng:
 *                           type: number
 *                           example: -46.634
 *                 maxParticipants:
 *                   type: integer
 *                   example: 30
 *                 createdBy:
 *                   type: string
 *                   example: "653b8f9c9d4e7a1f4c8b4568"
 *                 type:
 *                   type: string
 *                   enum: [class, lecture, workshop, other]
 *                   example: "workshop"
 *                 category:
 *                   type: string
 *                   example: "tecnologia"
 *       400:
 *         description: Erro de validação dos dados de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required field: title"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
eventRouter.post("/events/createNew", createNewEventController)


/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Edita os detalhes de um evento específico.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do evento a ser editado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Workshop de UX/UI para principiantes"
 *               description:
 *                 type: string
 *                 example: "Um workshop prático sobre como desenvolver aplicativos móveis usando React Native e Firebase."
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-10T12:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-10T20:00:00.000Z"
 *               location:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Laboratório de Informática Fagammon"
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         example: -23.551
 *                       lng:
 *                         type: number
 *                         example: -46.634
 *               maxParticipants:
 *                 type: integer
 *                 example: 30
 *               createdBy:
 *                 type: string
 *                 example: "653b8f9c9d4e7a1f4c8b4568"
 *               type:
 *                 type: string
 *                 enum: [class, lecture, workshop, other]
 *                 example: "workshop"
 *               category:
 *                 type: string
 *                 example: "tecnologia"
 *     responses:
 *       200:
 *         description: Evento editado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67f46194b66669802e62f7c9"
 *                 title:
 *                   type: string
 *                   example: "Workshop de UX/UI para principiantes"
 *                 description:
 *                   type: string
 *                   example: "Um workshop prático sobre como desenvolver aplicativos móveis usando React Native e Firebase."
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T12:00:00.000Z"
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T20:00:00.000Z"
 *                 location:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Laboratório de Informática Fagammon"
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: -23.551
 *                         lng:
 *                           type: number
 *                           example: -46.634
 *                 maxParticipants:
 *                   type: integer
 *                   example: 30
 *                 createdBy:
 *                   type: string
 *                   example: "653b8f9c9d4e7a1f4c8b4568"
 *                 type:
 *                   type: string
 *                   enum: [class, lecture, workshop, other]
 *                   example: "workshop"
 *                 category:
 *                   type: string
 *                   example: "tecnologia"
 *       400:
 *         description: Erro de validação dos dados de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required field: title"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
eventRouter.put("/events/:id", editEventController)



/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Deleta o evento.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do evento que deseja deletar.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Evento deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67f46194b66669802e62f7c9"
 *                 title:
 *                   type: string
 *                   example: "Workshop de UX/UI para principantes"
 *                 description:
 *                   type: string
 *                   example: "Um workshop prático sobre como desenvolver aplicativos móveis usando React Native e Firebase."
 *                 location:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: -23.551
 *                         lng:
 *                           type: number
 *                           example: -46.634
 *                     name:
 *                       type: string
 *                       example: "Laboratório de Informática Fagammon"
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T12:00:00.000Z"
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-10T20:00:00.000Z"
 *                 maxParticipants:
 *                   type: integer
 *                   example: 30
 *                 qrCodeData:
 *                   type: string
 *                   example: "https://fagammon.com/eventos/mobile-apps-2023"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Erro interno do servidor.
 */
eventRouter.delete("/events/:id", deleteEventController)


eventRouter.get('/events/getById', getEventByIdController)


export default eventRouter;
