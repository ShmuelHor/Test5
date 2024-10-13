import { Request, Response ,NextFunction} from "express";
import User, { IUser,ICreateUser } from "../models/userModel";
import Class , {IClass} from "../models/classModel";

export const createUser = async (req: Request, res: Response,next: NextFunction) => {

    try {
        const Userdata:ICreateUser = req.body;
    
        const userCreated:IUser = await User.create({fullName:Userdata.fullName ,email : Userdata.email, password : Userdata.password,
            role : "teacher" });
        if (!userCreated){
            res.status(400).json({ error: "Teacher not created", success: false });
        }
            console.log(userCreated._id)
            const classCreated:IClass = await Class.create({
                name: Userdata.nameClass,
                teacher: userCreated._id,
            })
            if (!classCreated) {
                 res.status(400).json({ error: "Class not created", success: false });
                 return;
            }
            res.status(201).json({ data: classCreated._id, success: true });

        
    } catch (error:any) {
        next(error);
    }  
};

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