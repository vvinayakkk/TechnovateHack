import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import "dotenv/config"

import {connectDB} from './services/index.js';
import {logger} from "./utils/index.js"
import {userRouter,frinedsRouter,eventRouter} from "./routers/index.js"

connectDB();

const app = express();
const PORT = process.env.PORT;


app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/user', userRouter);
app.use('/friends', frinedsRouter);
app.use('/event', eventRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
