"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentConrtoller_1 = require("../controllers/studentConrtoller");
const middleware_1 = require("../middleware/middleware");
const studentRouter = (0, express_1.Router)();
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
studentRouter.route("/").post(studentConrtoller_1.createStudent);
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
studentRouter.route("/login").post(studentConrtoller_1.studentLogin);
studentRouter.use(middleware_1.authMiddleware);
exports.default = studentRouter;
