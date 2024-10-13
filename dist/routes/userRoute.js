"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
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
userRouter.route("/").post(userControllers_1.createUser).get(userControllers_1.getUsers);
exports.default = userRouter;
