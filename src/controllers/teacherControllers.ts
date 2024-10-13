import e, { Request, Response ,NextFunction} from "express";
import User, { IUser,ICreateUser } from "../models/userModel";
import Class , {IClass} from "../models/classModel";
import Grade , {IGrade} from "../models/gradesModel";
import jwt from 'jsonwebtoken';

interface DecodedToken {
    teacherId: string;
  }
  
const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";

export const createTeacher = async (req: Request, res: Response,next: NextFunction) => {

    try {
        const Userdata:ICreateUser = req.body;
    
        const userCreated:IUser = await User.create({fullName:Userdata.fullName ,email : Userdata.email, password : Userdata.password,
            role : "teacher" });
        if (!userCreated){
           throw new Error("Teacher not created");
        }
            console.log(userCreated._id)
            const classCreated:IClass = await Class.create({
                name: Userdata.nameClass,
                teacher: userCreated._id,
            })
            if (!classCreated) {
                 throw new Error("Class not created");
            }
            res.status(201).json({ data: classCreated._id, success: true });

        
    } catch (error:any) {
        next(error);
    }  
};

export const loginTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: IUser = req.body;
        const userFind: IUser | null = await User.findOne( { email: user.email });
        
        if (userFind && userFind.password == user.password) {
            // bcrypt.compareSync(user.password, userFind.password)
            const token = jwt.sign({ teacherId: userFind._id}, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, 
                sameSite: 'strict',
              });
              res.send(token);
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (e: any) {
        next(e);
        
    }
}
export const addGrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const student = req.body;
       
        const studentFind: IUser | null = await User.findOne({email: student.studentEmail});
        if (!studentFind) {
            throw new Error('student not found');
        }
        const grade = await Grade.create({subject: student.subject, grade: student.grade, note: student.note});
        if (!grade) {
            throw new Error('Grade not created');
        }
        studentFind.grades?.push(grade._id);
        await studentFind.save();
        res.status(201).json({ data: grade, success: true });
    } catch (error: any) {
        next(error);
    }
}

export const getStudentsWithGrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        const user = await User.findById(decoded.teacherId);
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        const teachersClass = await Class.findOne({ teacher: user._id });
        if (!teachersClass) {
            res.status(404).json({ error: "No class found", success: false });
            return;
        }
        
        const studentsWithGrades = await User.aggregate([
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
    } catch (error: any) {
        next(error);
    }
};


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