import { Request, Response ,NextFunction} from "express";
import User, { IUser } from "../models/userModel";

export const createUser = async (req: Request, res: Response,next: NextFunction) => {

    try {
        const Userdata = req.body;
        const userCreated:IUser = await User.create(Userdata);
        if (!userCreated) {
             res.status(400).json({ error: "User not created", success: false });
             return;
        }
        res.status(201).json({ data: userCreated, success: true });
    } catch (error:any) {
        next(error);
    }  
};

export const getUsers = async (req: Request, res: Response ,next: NextFunction) => {
    try {
        const allUsers = await User.find();
        if (!allUsers) {
             res.status(400).json({ error: "No users found", success: false });
             return;
        }
        res.status(200).json({ data: allUsers, success: true });
    }
    catch (error:any) {
        next(error);
    }
};