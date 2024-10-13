"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherControllers_1 = require("../controllers/teacherControllers");
const middleware_js_1 = require("../middleware/middleware.js");
const teacherRouter = (0, express_1.Router)();
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
teacherRouter.route("/").post(teacherControllers_1.createTeacher);
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
teacherRouter.route("/login").post(teacherControllers_1.loginTeacher);
teacherRouter.use(middleware_js_1.authMiddleware);
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
teacherRouter.route("/addGrade").post(middleware_js_1.ifTeachersClass, teacherControllers_1.addGrade);
/**
 * @swagger
 * /school/teachers/getStudentsWithGrades:
 *   get:
 *     summary: get students with grades
 *     responses:
 *       200:
 *         description: students with grades
 */
teacherRouter.route("/getStudentsWithGrades").get(middleware_js_1.ifTeachersClass, teacherControllers_1.getStudentsWithGrades);
exports.default = teacherRouter;
