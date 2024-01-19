import userModels from "../models/userModels.js";

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name) {
        return next("Name is Required!!!");
    }

    if (!email) {
        return next("Email is Required!!!");
    }

    if (!password) {
        return next("Password is Required and should be at least 6 characters long!!!");
    }
    const existingUser = await userModels.findOne({ email });

    if (existingUser) {
            return next("Email already exists. Please use a different email.");
    }

    const user = await userModels.create({ name, email, password });
    //jaosn web token
    const token = user.createJWT();

    res.status(200).send({ message: 'User registered successfully', success: true , 
    user:{name: user.name , email:user.email , location: user.location } , token });

};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return next("Email is Required!!!");
    }

    if (!password) {
        return next("Password is Required and should be at least 6 characters long!!!");
    }
    if(!email || !password) {
        return next("Please provide an email and password");
    }
    const user = await userModels.findOne({ email }).select("+password");

    if (!user) {
        return next("Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next("Invalid email or password");
    }
     user.password = undefined;
    //jaosn web token
    const token = user.createJWT();

    res.status(200).send({ message: 'User logged in successfully', success: true , 
    user:{name: user.name , email:user.email , location: user.location } , token });

}

