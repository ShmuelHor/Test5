"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherControllers_1 = require("../controllers/teacherControllers");
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
exports.default = teacherRouter;
