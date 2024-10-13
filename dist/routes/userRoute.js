"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherControllers_1 = require("../controllers/teacherControllers");
const userRouter = (0, express_1.Router)();
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
userRouter.route("/").post(teacherControllers_1.createUser);
exports.default = userRouter;
