import express from "express";
import { getLessons, getLessonById, getScholarships } from "../controllers/dashboardDataController.js";
import userAuth from "../middleware/userAuth.js";

const dashboardDataRouter = express.Router();

dashboardDataRouter.get('/lessons', userAuth, getLessons);
dashboardDataRouter.get('/lessons/:id', userAuth, getLessonById);
dashboardDataRouter.get('/scholarships', userAuth, getScholarships);

export default dashboardDataRouter;
