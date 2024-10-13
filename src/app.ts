import express from "express";
import dotenv from "dotenv";
// import postRouter from "./routes/postRoutes";
import teacherRouter from "./routes/teacherRoute";
import studentRouter from "./routes/studentRoute";
import { errorHandler } from "./middleware/errorHandler";
import connectDB from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import cp from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
connectDB();
app.use(cp());

// Routes
// app.use("/api/posts", postRouter);
app.use("/school/teachers", teacherRouter);
app.use("/school/students", studentRouter);


// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
