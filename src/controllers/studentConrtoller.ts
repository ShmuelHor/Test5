import { Request, Response ,NextFunction} from "express";
import User, { IUser,ICreateUser } from "../models/userModel";
import Class , {IClass} from "../models/classModel";
import mongoose, { Schema, Document, Types } from "mongoose";
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";



export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Userdata: ICreateUser = req.body;
    
        const userCreated: IUser = await User.create({
            fullName: Userdata.fullName,
            email: Userdata.email,
            password: Userdata.password,
            role: "student"
        });

        if (!userCreated) {
            res.status(400).json({ error: "Student not created", success: false });
            return;
        }

        const classInstance: IClass | null = await Class.findOne({name: Userdata.nameClass });

        if (!classInstance) {
            res.status(400).json({ error: "Class not found", success: false });
            return;
        }

        classInstance.students.push(userCreated._id as unknown as Types.ObjectId);
        await classInstance.save();

        res.status(201).json({ data: classInstance._id, success: true });
        
    } catch (error: any) {
        next(error);
    }  
};

export const studentLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: IUser = req.body;
        const userFind: IUser | null = await User.findOne( { email: user.email });
        
       
        
        if (userFind && userFind.password == user.password) {
            // bcrypt.compareSync(user.password, userFind.password)
            const token = jwt.sign({ role: userFind.role, email: userFind.email }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, 
                sameSite: 'strict',
              });
              res.send(token);
        } else {
            throw new Error("Password incorrect");
        }
    } catch (e: any) {
        next(e);
        
    }
}