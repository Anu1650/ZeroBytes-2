import userModel from "../models/userModel.js";

export const getUserData = async (req , res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        res.json({success: true, userData: {
            name : user.name,
            isAccountVerified : user.isAccountVerified,
            }});
            
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// GET /api/user/dashboard-profile
export const getDashboardProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
      .select("-password")
      .populate("completedLessons", "title subject chapter");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/user/preferences
export const updatePreferences = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { preferences: req.body },
      { new: true, select: "-password" }
    );
    res.json({ message: "Preferences updated", preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/user/progress
export const updateProgress = async (req, res) => {
  try {
    const { subject, percentage, lessonId } = req.body;
    const update = { [`progress.${subject}`]: percentage };
    if (lessonId) {
      const user = await userModel.findByIdAndUpdate(
        req.userId,
        { $set: update, $addToSet: { completedLessons: lessonId } },
        { new: true, select: "progress completedLessons" }
      );
      return res.json(user);
    }
    const user = await userModel.findByIdAndUpdate(req.userId, { $set: update }, { new: true, select: "progress" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/user/wellness
export const logWellness = async (req, res) => {
  try {
    const { mood } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { $push: { wellnessLog: { mood, date: new Date() } } },
      { new: true, select: "wellnessLog" }
    );
    res.json({ message: "Mood logged", wellnessLog: user.wellnessLog.slice(-7) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};