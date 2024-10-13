import { Router } from "express";
import { createUser,getUsers} from "../controllers/userControllers";

const userRouter = Router();
/**
 * @swagger
 * /school/users: 
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 
 *               grades:
 *                 type: array
 *                 
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /school/users:
 *   get:
 *     summary: Get all users
 *     responses:
 * 
 *       200:
 *         description: Users retrieved successfully
 */
userRouter.route("/").post(createUser).get(getUsers);

export default userRouter;