import express from "express";
import { getUserData, getDashboardProfile, updatePreferences, updateProgress, logWellness } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get('/data', userAuth ,getUserData)
userRouter.get('/dashboard-profile', userAuth, getDashboardProfile);
userRouter.put('/preferences', userAuth, updatePreferences);
userRouter.put('/progress', userAuth, updateProgress);
userRouter.post('/wellness', userAuth, logWellness);

export default userRouter;