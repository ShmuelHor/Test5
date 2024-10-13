import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel.js';
import Class, { IClass } from '../models/classModel.js';
import { Types } from 'mongoose';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface DecodedToken {
  teacherId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const ifTeachersClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: 'Token not found' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user: IUser | null = await User.findById(decoded.teacherId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const classInstance: IClass | null = await Class.findOne({teacher: new Types.ObjectId(user._id as string) });
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
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export default { authMiddleware, ifTeachersClass };
