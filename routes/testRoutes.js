// testRoutes.js
import express from 'express';
import testController1 from "../controllers/testController.js";
import authUser from '../middlewares/authMiddleWare.js';

const router = express.Router();

router.post('/test-post',authUser, testController1);

export default router;
