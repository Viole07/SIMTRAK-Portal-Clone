import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  date: { type: Date, default: Date.now },
  taskId: String,                    // store Task.taskId for simplicity
  taskNote: String,
  learnings: String,
  status: String,                    // Ongoing/Completed
  timeMin: Number,
}, { timestamps: true });

export default mongoose.model("Journal", JournalSchema);
