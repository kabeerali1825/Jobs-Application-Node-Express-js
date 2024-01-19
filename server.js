// imports pakages
import express from 'express';
import dotenv from 'dotenv';
import "express-async-errors"; // get rid of try catch Blocks
import cors from 'cors';
import morgan from 'morgan';

//API DOCUMENTATIONS
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// imports files
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import connectDB from './config/db.js';
import errorMiddlewaree from './middlewares/errorMiddleWare.js';

//security Pacakges
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
// config
dotenv.config();
connectDB();

//Swagger Config Options
const swaggerOptions = {
    openapi: '3.0.0',
    swaggerDefinition: {
        info: {
            title: 'Job Portal API',
            description: 'Job Portal API Information',
            contact: {
                name: 'Amazing Developer'
            },
            servers: ['http://localhost:5000']
        }
    },
    // ['.routes/*.js']
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// rest objects
const app = express();
//Middlewares
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
// routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

//home route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Jobs Routes
app.use('/api/v1/jobs', jobsRoutes);
//Error MiddleWares
app.use(errorMiddlewaree)
// PORT
//get api 
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Node server running
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.Dev_Mode} mode on port ${PORT}`.bgCyan.white);
});
