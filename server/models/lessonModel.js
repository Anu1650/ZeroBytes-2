import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { 
    type: String, 
    required: true,
    enum: ["physics", "maths", "social", "science"]
  },
  chapter: { type: Number, required: true },
  duration: { type: Number, required: true }, // minutes
  content: { type: String, required: true },
  audioUrl: { type: String },
  imageUrl: { type: String },
  visualAidCaption: { type: String },
  tags: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },
  isAudioFirst: { type: Boolean, default: false },
  signLanguageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const lessonModel = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
export default lessonModel;
