// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

// db Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add other options as needed
        });
//want magenda color
        console.log("MongoDB URI Connected:", process.env.MongoDB_URI.magenta.bold);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
