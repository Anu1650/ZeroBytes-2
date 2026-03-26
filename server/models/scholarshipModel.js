import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scheme: { type: String },
  description: { type: String },
  deadline: { type: Date },
  applyUrl: { type: String },
  eligibility: [{ type: String }],
  isNew: { type: Boolean, default: true },
  category: { 
    type: String,
    enum: ["disability", "merit", "income", "state", "central"],
    default: "disability"
  }
});

const scholarshipModel = mongoose.models.Scholarship || mongoose.model('Scholarship', scholarshipSchema);
export default scholarshipModel;
