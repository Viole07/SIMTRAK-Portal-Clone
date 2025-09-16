import { Router } from "express";
import Task from "../models/Task.js";
import auth from "../mw/auth.js";

const r = Router();

// generate client-friendly ID
const genId = () => `TSK-${Math.floor(10000 + Math.random()*90000)}`;

r.get("/", auth, async (req,res)=> {
  const items = await Task.find({ userId: req.uid }).sort({ createdAt: -1 });
  res.json({ items });
});

r.post("/", auth, async (req,res)=> {
  const { name, deadline, assignedBy } = req.body;
  const item = await Task.create({
    userId: req.uid,
    taskId: genId(),
    name,
    deadline: deadline ? new Date(deadline) : undefined,
    assignedBy: assignedBy || "Self",
  });
  res.json({ item });
});

r.patch("/:id", auth, async (req,res)=> {
  const item = await Task.findOneAndUpdate(
    { userId: req.uid, _id: req.params.id },
    req.body,
    { new: true }
  );
  res.json({ item });
});

r.delete("/:id", auth, async (req,res)=> {
  await Task.deleteOne({ userId: req.uid, _id: req.params.id });
  res.json({ ok: true });
});

export default r;
