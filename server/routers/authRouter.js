import express from 'express';
import {getUser,createUser,leadearboard} from "../controllers/index.js";

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.post('/get', getUser);
userRouter.get('/leaderboard', leadearboard);

export default userRouter;