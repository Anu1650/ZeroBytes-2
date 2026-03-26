import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => { 
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try { 
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // ✅ Welcome email moved here from login
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to AccessLearn',
            text: `Welcome to AccessLearn. Your account has been created with email: ${email}`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
    }

    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {  // ✅ Fixed: added req, res
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password required' });
    }

    try {
        const user = await userModel.findOne({ email }); // ✅ Fixed: was findOne([email])

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // ✅ Fixed: was user_id

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged Out' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Send verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({ success: false, message: 'User not authorized' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.verifyotp = otp;
        user.verifyexpires = expiresAt;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your email',
            text: `Your verification OTP is ${otp}. It is valid for 15 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Verifying the Email using OTP
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const submittedOtp = String(otp).trim();

        const user = await userModel.findOne({ verifyotp: submittedOtp });

        if (!user) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyexpires < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountverified = true;
        user.verifyotp = '';
        user.verifyexpires = 0;

        await user.save();
        return res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOption); // ✅ Removed duplicate commented-out call

        return res.json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body; // ✅ Fixed: was 'emial'

    if (!email || !otp || !newPassword) { // ✅ Fixed: was 'email ||' (missing !)
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' }); // ✅ Fixed: was 'ture'
        }

        if (user.resetExpires < Date.now()) { // ✅ Fixed: was resetOtpExpireAT (inconsistent name)
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetExpires = 0; // ✅ Fixed: was resetOtpExpireAT (inconsistent name)

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}