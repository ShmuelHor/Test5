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
exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const classModel_1 = __importDefault(require("../models/classModel"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Userdata = req.body;
        const userCreated = yield userModel_1.default.create({ fullName: Userdata.fullName, email: Userdata.email, password: Userdata.password,
            role: "teacher" });
        if (!userCreated) {
            res.status(400).json({ error: "Teacher not created", success: false });
        }
        console.log(userCreated._id);
        const classCreated = yield classModel_1.default.create({
            name: Userdata.nameClass,
            teacher: userCreated._id,
        });
        if (!classCreated) {
            res.status(400).json({ error: "Class not created", success: false });
            return;
        }
        res.status(201).json({ data: classCreated._id, success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
// export const getUsers = async (req: Request, res: Response ,next: NextFunction) => {
//     try {
//         const allUsers = await User.find();
//         if (!allUsers) {
//              res.status(400).json({ error: "No users found", success: false });
//              return;
//         }
//         res.status(200).json({ data: allUsers, success: true });
//     }
//     catch (error:any) {
//         next(error);
//     }
// };
