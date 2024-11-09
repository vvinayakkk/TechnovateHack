import mongoose from "mongoose"
import "dotenv/config"

import {logger} from "../../utils/index.js"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        logger.info('connected to database successfully')
    } catch (err) {
        logger.error(err)
    }
}

export default connectDB