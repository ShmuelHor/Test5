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
exports.ifTeachersClass = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const classModel_js_1 = __importDefault(require("../models/classModel.js"));
const mongoose_1 = require("mongoose");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Access token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const ifTeachersClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield userModel_js_1.default.findById(decoded.teacherId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const classInstance = yield classModel_js_1.default.findOne({ teacher: new mongoose_1.Types.ObjectId(user._id) });
        if (!classInstance) {
            res.status(404).json({ message: 'Class not found' });
            return;
        }
        if (user.role !== 'teacher' || `${classInstance.teacher}` !== `${decoded.teacherId}`) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        console.log("first");
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});
exports.ifTeachersClass = ifTeachersClass;
exports.default = { authMiddleware: exports.authMiddleware, ifTeachersClass: exports.ifTeachersClass };
