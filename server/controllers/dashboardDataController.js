import lessonModel from "../models/lessonModel.js";
import scholarshipModel from "../models/scholarshipModel.js";

// GET /api/data/lessons
export const getLessons = async (req, res) => {
  try {
    const { subject, limit = 10 } = req.query;
    const filter = subject ? { subject } : {};
    const lessons = await lessonModel.find(filter).limit(Number(limit)).sort({ chapter: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/lessons/:id
export const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonModel.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/scholarships
export const getScholarships = async (req, res) => {
  try {
    const scholarships = await scholarshipModel.find().sort({ deadline: 1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
