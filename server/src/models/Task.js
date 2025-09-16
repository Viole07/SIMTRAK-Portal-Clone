import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  taskId: { type: String, index: true },              // e.g., TSK-12345
  name: String,
  status: { type: String, default: "Ongoing" },       // Ongoing | Done
  date: { type: Date, default: Date.now },
  deadline: Date,
  assignedBy: String,
  notes: [String],
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
