import { Router } from "express";
import { createTeacher,loginTeacher,addGrade,getStudentsWithGrades} from "../controllers/teacherControllers";
import {authMiddleware,ifTeachersClass} from "../middleware/middleware.js";


const teacherRouter = Router();
/**
 * @swagger
 * /school/teachers: 
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
teacherRouter.route("/").post(createTeacher);

/**
 * @swagger
 * /school/teachers/login: 
 *   post:
 *     summary: login teacher
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
 *         description: teacher login successfully
 */
teacherRouter.route("/login").post(loginTeacher);
teacherRouter.use(authMiddleware);
/**
 * @swagger
 * /school/teachers/addGrade: 
 *   post:
 *     summary: add grade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentEmail:
 *                 type: string
 *               subject:
 *                 type: string
 *               grade:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: grade added successfully
 */
teacherRouter.route("/addGrade").post(ifTeachersClass,addGrade);

/**
 * @swagger
 * /school/teachers/getStudentsWithGrades: 
 *   get:
 *     summary: get students with grades
 *     responses:
 *       200:
 *         description: students with grades
 */
teacherRouter.route("/getStudentsWithGrades").get(ifTeachersClass,getStudentsWithGrades);

export default teacherRouter;