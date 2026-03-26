import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import dashboardDataRouter from './routes/dashboardDataRoutes.js';
import lessonModel from './models/lessonModel.js';
import scholarshipModel from './models/scholarshipModel.js';
import userModel from './models/userModel.js';
import userAuth from './middleware/userAuth.js';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:3000',
        'null'
    ],
    credentials: true
}));
app.use(express.static('../client'));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/data', dashboardDataRouter);

// ============================================================
// STREAK UPDATE — POST /api/user/update-streak
// Called on every dashboard load; auto-increments daily streak
// ============================================================
app.post('/api/user/update-streak', userAuth, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastLogin = user.streak?.lastLoginDate
            ? new Date(user.streak.lastLoginDate)
            : null;

        let current = user.streak?.current || 0;
        let longest = user.streak?.longest || 0;

        if (lastLogin) {
            lastLogin.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                current += 1;
                if (current > longest) longest = current;
            } else if (diffDays > 1) {
                current = 1;
            }
            // diffDays === 0: same-day login, no change
        } else {
            current = 1;
            longest = 1;
        }

        user.streak = {
            current,
            longest,
            lastLoginDate: today,
            loginHistory: [...(user.streak?.loginHistory || []), today]
        };
        await user.save();

        res.json({ success: true, streak: user.streak });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// ============================================================
// LESSON WRITE ROUTES (unprotected — for admin seeding)
// ============================================================
app.post('/api/data/lessons', async (req, res) => {
    try {
        const lesson = new lessonModel(req.body);
        await lesson.save();
        res.status(201).json({ success: true, message: 'Lesson added', lesson });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/data/lessons/:id', async (req, res) => {
    try {
        const lesson = await lessonModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });
        res.json({ success: true, lesson });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ============================================================
// SCHOLARSHIP WRITE ROUTE (unprotected — for admin seeding)
// ============================================================
app.post('/api/data/scholarships', async (req, res) => {
    try {
        const scholarship = new scholarshipModel(req.body);
        await scholarship.save();
        res.status(201).json({ success: true, message: 'Scholarship added', scholarship });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ============================================================
// SEED ROUTE — GET /api/seed
// Populates DB with sample lessons + scholarships
// ============================================================
app.get('/api/seed', async (req, res) => {
    try {
        await lessonModel.deleteMany({});
        await scholarshipModel.deleteMany({});

        await lessonModel.insertMany([
            {
                title: "Chemical Reactions",
                subject: "science",
                chapter: 1,
                duration: 14,
                content: "A <span class='highlight'>chemical reaction</span> is a process where substances (reactants) are converted into different substances (products). Chemical reactions involve breaking and forming chemical bonds. Key indicators: color change, gas production, temperature change, precipitate formation.",
                tags: ["chemistry", "reactions", "bonds"],
                difficulty: "medium",
                isAudioFirst: true,
                visualAidCaption: "Diagram showing reactants converting to products"
            },
            {
                title: "Quadratic Equations",
                subject: "maths",
                chapter: 4,
                duration: 22,
                content: "A <span class='highlight'>quadratic equation</span> is of the form ax\u00b2 + bx + c = 0, where a \u2260 0. Solutions can be found using the quadratic formula: x = (\u2212b \u00b1 \u221a(b\u00b2\u22124ac)) / 2a. The <span class='highlight'>discriminant</span> (b\u00b2\u22124ac) determines the nature of roots.",
                tags: ["algebra", "equations", "quadratic"],
                difficulty: "hard",
                isAudioFirst: true,
                visualAidCaption: "Graph: Parabola showing roots of equation"
            },
            {
                title: "Newton's First Law of Motion",
                subject: "physics",
                chapter: 3,
                duration: 18,
                content: "<span class='highlight'>Inertia</span> is the tendency of objects in motion to stay in motion, and objects at rest to stay at rest, unless acted upon by an external force.",
                tags: ["force", "motion", "newton", "inertia"],
                difficulty: "medium",
                isAudioFirst: false,
                visualAidCaption: "Visual Aid: A sphere illustrating inertia"
            },
            {
                title: "Light and Reflection",
                subject: "physics",
                chapter: 1,
                duration: 20,
                content: "<span class='highlight'>Light</span> travels in straight lines called rays. When light hits a smooth surface, it reflects. The angle of incidence equals the angle of reflection.",
                tags: ["light", "optics", "reflection"],
                difficulty: "easy",
                isAudioFirst: true,
                visualAidCaption: "Diagram: Angle of incidence = Angle of reflection"
            },
            {
                title: "Democratic Politics",
                subject: "social",
                chapter: 2,
                duration: 12,
                content: "<span class='highlight'>Democracy</span> is a system of government where citizens exercise power by voting. India is the world's largest democracy.",
                tags: ["civics", "democracy", "government"],
                difficulty: "easy",
                isAudioFirst: true,
                visualAidCaption: "Diagram: Structure of Indian Government"
            }
        ]);

        await scholarshipModel.insertMany([
            {
                name: "PM-USP Disability Scholarship",
                scheme: "PM-USP",
                description: "Pre-Matric scholarship for students with disabilities. Apply before Oct 15.",
                deadline: new Date("2025-10-15"),
                applyUrl: "https://scholarships.gov.in",
                eligibility: ["Disability certificate required", "Pre-matric level", "Family income < \u20b92.5L"],
                isNew: true,
                category: "disability"
            },
            {
                name: "National Scholarship Portal",
                scheme: "NSP",
                description: "Central government merit-cum-means scholarship for Class 9-12 students.",
                deadline: new Date("2025-11-30"),
                applyUrl: "https://scholarships.gov.in",
                eligibility: ["Class 9-12", "Marks > 50%", "Income < \u20b93.5L"],
                isNew: false,
                category: "merit"
            },
            {
                name: "Maharashtra Disability Scheme",
                scheme: "Mahadbt",
                description: "State-level scholarship for ADHD/Dyslexia/Learning Disability students in Maharashtra.",
                deadline: new Date("2025-12-31"),
                applyUrl: "https://mahadbt.maharashtra.gov.in",
                eligibility: ["Maharashtra resident", "Disability certificate", "Any income"],
                isNew: true,
                category: "state"
            }
        ]);

        res.json({ success: true, message: '\u2705 Sample data seeded! 5 lessons + 3 scholarships added.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(port, () => console.log(`
\u256c\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551   \ud83c\udf31 AccessLearn \u2014 AI Sahayak Server                \u2551
\u2551   Port : ${port}                                       \u2551
\u2551   Seed : GET http://localhost:${port}/api/seed          \u2551
\u2569\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
`));
