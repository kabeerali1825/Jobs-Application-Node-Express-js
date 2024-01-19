// jobsController.js
import jobModel from "../models/JobsModel.js";
import mongoose from "mongoose";
import moment from "moment";
export const CreateJobsControlled = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return next('All fields are required!!!');
    }
    req.body.createdBy = req.user.userId;

    try {
        const job = await jobModel.create(req.body);
        res.status(201).json({
            success: true,
            job
        });
    } catch (error) {
        next(error);
    }
};
export const getAllJobsController = async (req, res, next) => {
    try {
        const { status, workType, search, sort } = req.query;
        const queryObject = {
            createdBy: req.user.userId
        };

        // Logic Filters
        if (status && status !== 'all') {
            queryObject.status = status;
        }
        if (workType && workType !== 'all') {
            queryObject.workType = workType;
        }
        if (search) {
            queryObject.position = { $regex: search, $options: "i" };
        }

        // Sorting
        let jobsQuery = jobModel.find(queryObject);

        if (sort === "latest") {
            jobsQuery = jobsQuery.sort({ createdAt: -1 });
        }
        if (sort === "oldest") {
            jobsQuery = jobsQuery.sort({ createdAt: 1 });
        }
        if (sort === "a-z") {
            jobsQuery = jobsQuery.sort({ position: 1 });
        }
        if (sort === "z-a") {
            jobsQuery = jobsQuery.sort({ position: -1 });
        }

const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;



// Apply skip and limit to the Mongoose query
const jobs = await jobsQuery.skip(skip).limit(limit).exec();

        // Jobs count
        const totalJobs = await jobModel.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalJobs / limit);

        res.status(200).json({
            success: true,
            totalJobs,
            jobs,
            numOfPages
        });
    } catch (error) {
        next(error);
    }
};
 export const updateJobController = async (req, res, next) => {

    const { company, position, status, workType, workLocation } = req.body;
    if (!company || !position || !workType || !workLocation || !status) {
        return next('All fields are required!!!');
    }

    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return next(`Job not found with This Id ${req.params.id}`);
        }
        if (job.createdBy.toString() !== req.user.userId) {
            return next('You are not authorized to update this job');
        }
        const updatedJob = await jobModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            success: true,
            job: updatedJob
        });
    } catch (error) {
        next(error);
    }
 };
 export const deleteJobController = async (req, res, next) => {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return next(`Job not found with This Id ${req.params.id}`);
        }
        if (job.createdBy.toString() !== req.user.userId) {
            return next('You are not authorized to delete this job');
        }
        await jobModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
// Jobs stats and analytics
export const getJobStatsController = async (req, res, next) => {
    try {
        const stats = await jobModel.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }
            },
            {
                $limit: 1000 // Adjust the limit based on your data size
            },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    total: 1
                }
            }
        ]);

        // Default stats remain the same
        const defaultStats = [
            {
                status: 'applied',
                total: 0
            },
            {
                status: 'interview',
                total: 0
            },
            {
                status: 'offer',
                total: 0
            },
            {
                status: 'rejected',
                total: 0
            }
        ];

        let monthlyApplication = await jobModel.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    year: '$_id.year',
                    total: 1
                }
            }
        ]);
        
        monthlyApplication = monthlyApplication.map(item => {
            const { year, month, total } = item;
            const date = moment().month(month - 1).year(year).format('MMM YYYY');
            return {
                date,
                total
            };
        }).reverse();
        res.status(200).json({
            totalJobs: stats.length,
            success: true,
            defaultStats,
            monthlyApplication
        });
        
    } catch (error) {
        next(error);
    }
};

