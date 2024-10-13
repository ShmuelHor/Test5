import mongoose, { Schema, Document, Types } from "mongoose";

export interface Grade extends Document {
    _id: Types.ObjectId;
    subject: string;
    grade: number;
}


const gradeSchema: Schema<Grade> = new Schema<Grade>({
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    grade: {
        type: Number,
        required: [true, "Grade is required"],
    },
});

export default mongoose.model<Grade>("Grade", gradeSchema);