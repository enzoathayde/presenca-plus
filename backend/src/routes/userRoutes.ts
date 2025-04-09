import express, { Express, Router } from "express";
import { getAllUsersController, createNewUserController, editUserController, deleteUserController} from "../controllers/userController";



const userRouter = express.Router()

/**
 * @swagger
 * /api/users/getAll:
 *   get:
 *     summary: Retorna todos os usuários contidos no banco de dados 
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       500:
 *         description: Erro interno do servidor.
 */
userRouter.get("/users/getAll", getAllUsersController)

/**
 * @swagger
 * /api/users/createNew:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teste da Silva
 *               email:
 *                 type: string
 *                 example: teste@example.com
 *               password:
 *                 type: string
 *                 example: teste123*
 *               course:
 *                 type: string
 *                 example: Engenharia de Testes
 *               registration:
 *                 type: string
 *                 example: 99999999999
 *               role:
 *                 type: string
 *                 enum: [aluno, professor, admin]
 *                 example: aluno
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */

userRouter.post("/users/createNew", createNewUserController)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Edita os dados de um usuário
 *     description: Atualiza nome, email, curso, matrícula e cargo de um usuário existente.
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário em banco que será editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - course
 *               - registration
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Usuário Atualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: atualizado@example.com
 *               course:
 *                 type: string
 *                 example: Sistemas de Informação
 *               registration:
 *                 type: string
 *                 example: 112233445566
 *               role:
 *                 type: string
 *                 enum: [aluno, professor, admin]
 *                 example: professor
 *     responses:
 *       201:
 *         description: Usuário editado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 64f0c1b8e913f8c4a6a79b19
 *                 name:
 *                   type: string
 *                   example: Usuário Atualizado
 *                 email:
 *                   type: string
 *                   example: atualizado@example.com
 *                 course:
 *                   type: string
 *                   example: Sistemas de Informação
 *                 registration:
 *                   type: string
 *                   example: 112233445566
 *                 role:
 *                   type: string
 *                   example: professor
 *       400:
 *         description: Dados obrigatórios ausentes.
 *       500:
 *         description: Erro interno do servidor.
 */
userRouter.put("/users/:id", editUserController)



/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deleta o usuário
 *     description: Deletar todo o registro do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário em banco que será deletado
 *     responses:
 *       201:
 *         description: Usuário deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 64f0c1b8e913f8c4a6a79b19
 *                 name:
 *                   type: string
 *                   example: Usuário Atualizado
 *                 email:
 *                   type: string
 *                   example: atualizado@example.com
 *                 course:
 *                   type: string
 *                   example: Sistemas de Informação
 *                 registration:
 *                   type: string
 *                   example: 112233445566
 *                 role:
 *                   type: string
 *                   example: professor
 *       404:
 *         description: Usuário Não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                error:
 *                 type: string
 *                 example: User not found
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                error:
 *                 type: string
 *                 example: Internal server error
 */
userRouter.delete("/users/:id", deleteUserController)


export default userRouter;
