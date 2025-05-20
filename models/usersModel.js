const { number } = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required!'],
            trim: true,
            unique: [true, 'Email should be unique!'],
            minLength: [5, 'Email must have 5 characters'],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            trim: true,
            select: false,
            minLength: [8, 'password must be eight characters length'],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            select: false,
        },
        verifiedCodeValidation: {
            type: Number,
            select: false,
        },
        forgotPasswordCode: {
            type: String,
            select: false,
        },
        forgotPasswordCodeValidation: {
            type: Number,
            select: false,
        },
    }, {
        timestamps:true
    });
    module.exports = mongoose.model("User", userSchema);
