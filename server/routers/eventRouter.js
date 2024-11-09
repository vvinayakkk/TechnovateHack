import express from 'express';
import {
  createEvent,
  registerForEvent,
  getEvents,

} from '../controllers/index.js';

const eventRouter = express.Router();

eventRouter.post('/create', createEvent);
eventRouter.post('/register', registerForEvent);
eventRouter.get('/get-events', getEvents);


export default eventRouter;