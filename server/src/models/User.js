import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
  fullName: String,
  gradDetails: String,
  postGradDetails: String,
  collegeTimings: String,
  workingTimings: String,
  hometown: String,
  hobbies: String,
  skills: String,
  careerPlan: String,
  objective: String,
  hasLaptop: String,       // yes/no
  domain: String,
  joiningDate: Date,
  team: String,
  onboardedBy: String,
  academicRequirement: String, // Yes/No
  internshipType: String,      // Intense/Mediocre
  // ainNo & ninNo REMOVED from profile
  emailId: String,
  expectations: String,
  languagesKnown: String,
  pastInternship: String,
  schoolName: String,
  comfortableTeaching: String,
  weakness: String,
  jobStartWhen: String,
  connectors: String,
  photoUrl: String
}, { _id:false })

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String },
  status: { type: String, enum: ['pending_approval','active'], default: 'pending_approval' },
  role: { type: String, enum: ['user','admin'], default: 'user' },

  // NEW: top-level IDs
  ninNo: { type: String, unique: true, sparse: true }, // auto-generated 5-digit
  ainNo: { type: String },                              // set later by company

  profile: ProfileSchema
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
