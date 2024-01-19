import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    lastname: {
        type: String,
        required: [true, 'Please enter your lastname'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false,
    },
    location: {
        type: String,
        required: [true, 'Please enter your location'],
        default: 'Nigeria',
    },
}, { timestamps: true });

// Encrypt password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// Compare user password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// Json web token
userSchema.methods.createJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};


const User = mongoose.model('User', userSchema);

export default User;
