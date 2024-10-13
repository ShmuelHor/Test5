"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentLogin = exports.createStudent = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const classModel_1 = __importDefault(require("../models/classModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const createStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Userdata = req.body;
        const userCreated = yield userModel_1.default.create({
            fullName: Userdata.fullName,
            email: Userdata.email,
            password: Userdata.password,
            role: "student"
        });
        if (!userCreated) {
            res.status(400).json({ error: "Student not created", success: false });
            return;
        }
        const classInstance = yield classModel_1.default.findOne({ name: Userdata.nameClass });
        if (!classInstance) {
            res.status(400).json({ error: "Class not found", success: false });
            return;
        }
        classInstance.students.push(userCreated._id);
        yield classInstance.save();
        res.status(201).json({ data: classInstance._id, success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.createStudent = createStudent;
const studentLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const userFind = yield userModel_1.default.findOne({ email: user.email });
        if (userFind && userFind.password == user.password) {
            // bcrypt.compareSync(user.password, userFind.password)
            const token = jsonwebtoken_1.default.sign({ role: userFind.role, email: userFind.email }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'strict',
            });
            res.send(token);
        }
        else {
            throw new Error("Password incorrect");
        }
    }
    catch (e) {
        next(e);
    }
});
exports.studentLogin = studentLogin;
