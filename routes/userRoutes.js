import express from 'express';
import authUser from '../middlewares/authMiddleWare.js';
// userRoutes.js
import { updateUserController } from '../controllers/userController.js';

const router = express.Router();


// Corrected route for user registration
//update user || put
router.put('/update-user', authUser, updateUserController);

export default router;
