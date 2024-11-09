import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendList
} from '../controllers/index.js';

const frinedsRouter = express.Router();

frinedsRouter.post('/send-request', sendFriendRequest);
frinedsRouter.post('/accept-request', acceptFriendRequest);
frinedsRouter.post('/reject-request', rejectFriendRequest);
frinedsRouter.post('/list', getFriendList);

export default frinedsRouter;