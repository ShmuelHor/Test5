import { Router } from "express";
import { createUser} from "../controllers/teacherControllers";

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
 *               nameClass:
 *                 type: string
 *                 
 *     responses:
 *       201:
 *         description: User created successfully
 */


userRouter.route("/").post(createUser);

export default userRouter;