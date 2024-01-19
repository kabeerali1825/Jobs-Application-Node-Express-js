// userController.js
import userModels from "../models/userModels.js";

export const updateUserController = async (req, res, next) => {
    const { name, email, lastname, location } = req.body;
    if (!name || !email || !lastname || !location) {
        return next("All fields are required!!!");
    }

    try {
        // Assuming req.user.userId contains the valid user ID
        const userId = req.user.userId;

        // Use findByIdAndUpdate to simplify the update process
        const user = await userModels.findByIdAndUpdate(
            userId,
            { name, email, lastname, location },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next("User not found");
        }

        const token = user.createJWT();
        res.json({
            message: 'User updated successfully',
            success: true,
            user: { name: user.name, email: user.email, location: user.location },
            token
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
