import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyotp: {
        type: String,
        default : ''
    },
    verifyexpires: {
        type: Number,
        default : 0
    },
    isAccountverified: {
        type: Boolean,
        default : false
    },
    resetOtp: {
        type: String,
        default : ''
    },
    resetExpires: {
        type: Number,
        default : 0
    },
    // Dashboard fields
    school: { type: String },
    grade: { type: String },
    abilityType: { 
        type: [String], 
        enum: ["ADHD", "Dyslexia", "Low Vision", "None"],
        default: ["None"]
    },
    preferences: {
        highContrast: { type: Boolean, default: false },
        dyslexicFont: { type: Boolean, default: false },
        textToSpeech: { type: Boolean, default: false },
        language: { type: String, default: "English" },
        darkMode: { type: Boolean, default: false }
    },
    streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastLoginDate: { type: Date },
        loginHistory: [{ type: Date }]
    },
    progress: {
        physics: { type: Number, default: 0 },
        maths: { type: Number, default: 0 },
        social: { type: Number, default: 0 },
        science: { type: Number, default: 0 }
    },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    wellnessLog: [{
        date: { type: Date, default: Date.now },
        mood: { type: String, enum: ["happy", "neutral", "tired", "stressed"] }
    }]
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;