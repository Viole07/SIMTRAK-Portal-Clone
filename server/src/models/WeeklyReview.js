import mongoose from "mongoose";

const WeeklyReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  weekStart: Date,
  weekEnd: Date,
  summary: String,
  status: { type: String, default: "Submitted" },
  stamp: String,
}, { timestamps: true });

export default mongoose.model("WeeklyReview", WeeklyReviewSchema);
