import express from 'express';
import authUser from '../middlewares/authMiddleWare.js';
import { CreateJobsControlled, deleteJobController,  getAllJobsController, getJobStatsController, updateJobController } from '../controllers/jobsController.js';

const router = express.Router();

// Corrected route for uProfiel registration

router.post('/Create-job', authUser,CreateJobsControlled);
router.get('/get-jobs', authUser,getAllJobsController);
router.patch('/update-job/:id', authUser ,updateJobController);
router.delete('/delete-job/:id', authUser, deleteJobController);
router.get('/jobs-stats', authUser,getJobStatsController)

export default router;