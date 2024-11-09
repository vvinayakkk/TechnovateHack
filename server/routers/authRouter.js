import express from 'express';
import {getUser,createUser} from "../controllers/index.js";

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.post('/get', getUser);

export default userRouter;