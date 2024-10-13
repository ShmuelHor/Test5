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
exports.getStudentsWithGrades = exports.addGrade = exports.loginTeacher = exports.createTeacher = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const classModel_1 = __importDefault(require("../models/classModel"));
const gradesModel_1 = __importDefault(require("../models/gradesModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const createTeacher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Userdata = req.body;
        const userCreated = yield userModel_1.default.create({ fullName: Userdata.fullName, email: Userdata.email, password: Userdata.password,
            role: "teacher" });
        if (!userCreated) {
            throw new Error("Teacher not created");
        }
        console.log(userCreated._id);
        const classCreated = yield classModel_1.default.create({
            name: Userdata.nameClass,
            teacher: userCreated._id,
        });
        if (!classCreated) {
            throw new Error("Class not created");
        }
        res.status(201).json({ data: classCreated._id, success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.createTeacher = createTeacher;
const loginTeacher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const userFind = yield userModel_1.default.findOne({ email: user.email });
        if (userFind && userFind.password == user.password) {
            // bcrypt.compareSync(user.password, userFind.password)
            const token = jsonwebtoken_1.default.sign({ teacherId: userFind._id }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'strict',
            });
            res.send(token);
        }
        else {
            throw new Error("Invalid credentials");
        }
    }
    catch (e) {
        next(e);
    }
});
exports.loginTeacher = loginTeacher;
const addGrade = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const student = req.body;
        const studentFind = yield userModel_1.default.findOne({ email: student.studentEmail });
        if (!studentFind) {
            throw new Error('student not found');
        }
        const grade = yield gradesModel_1.default.create({ subject: student.subject, grade: student.grade, note: student.note });
        if (!grade) {
            throw new Error('Grade not created');
        }
        (_a = studentFind.grades) === null || _a === void 0 ? void 0 : _a.push(grade._id);
        yield studentFind.save();
        res.status(201).json({ data: grade, success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.addGrade = addGrade;
const getStudentsWithGrades = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield userModel_1.default.findById(decoded.teacherId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const teachersClass = yield classModel_1.default.findOne({ teacher: user._id });
        if (!teachersClass) {
            res.status(404).json({ error: "No class found", success: false });
            return;
        }
        const studentsWithGrades = yield userModel_1.default.aggregate([
            { $match: { _id: { $in: teachersClass.students } } },
            {
                $lookup: {
                    from: 'grades',
                    localField: 'grades',
                    foreignField: '_id',
                    as: 'grades'
                }
            }
        ]);
        res.status(200).json({ data: studentsWithGrades, success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.getStudentsWithGrades = getStudentsWithGrades;
// export const UpdateGrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { studentEmail, subject, grade } = req.body;
//         const studentFind: IUser | null = await User.findOne({ email: studentEmail }, { grades: 1 });
//         if (!studentFind) {
//             throw new Error('student not found');
//         }
//         const studentGrade: IGrade | null = studentFind.grades?.find((g) => g.subject === subject);
//         if (!studentGrade) {
//             throw new Error('Grade not found');
//         }
//         studentGrade.grade = grade;
//         await studentFind.save();
//         res.status(200).json({ data: studentGrade, success: true });
//     } catch (error:any) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
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
