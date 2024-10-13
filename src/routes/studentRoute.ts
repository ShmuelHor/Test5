import { Router } from "express";
import { createStudent,studentLogin} from "../controllers/studentConrtoller";
import { authMiddleware, ifTeachersClass } from "../middleware/middleware";

const studentRouter = Router();

/**
 * @swagger
 * /school/students: 
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
studentRouter.route("/").post(createStudent);
/**
 * @swagger
 * /school/students/login: 
 *   post:
 *     summary: login student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: student login successfully
 */
studentRouter.route("/login").post(studentLogin);
studentRouter.use(authMiddleware);

export default studentRouter;