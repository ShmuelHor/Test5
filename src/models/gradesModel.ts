import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGrade extends Document {
    _id: Types.ObjectId;
    subject: string;
    grade: number;
    note?: string;
}


const gradeSchema: Schema<IGrade> = new Schema<IGrade>({
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    grade: {
        type: Number,
        required: [true, "Grade is required"],
    },
    note: {
        type: String,
    }
});

export default mongoose.model<IGrade>("Grade", gradeSchema);