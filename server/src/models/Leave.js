import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  from: Date,
  joining: Date,
  reason: String,
  handover: String,
}, { timestamps: true });

export default mongoose.model("Leave", LeaveSchema);
