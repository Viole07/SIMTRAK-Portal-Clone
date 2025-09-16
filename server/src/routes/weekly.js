import { Router } from "express";
import Weekly from "../models/WeeklyReview.js";
import auth from "../mw/auth.js";

const r = Router();

r.get("/", auth, async (req,res)=> {
  const items = await Weekly.find({ userId: req.uid }).sort({ createdAt: -1 });
  res.json({ items });
});

r.post("/", auth, async (req,res)=> {
  const { weekStart, weekEnd, summary } = req.body;
  const item = await Weekly.create({
    userId: req.uid,
    weekStart: new Date(weekStart),
    weekEnd: new Date(weekEnd),
    summary,
    status: "Submitted",
    stamp: new Date().toLocaleString(),
  });
  res.json({ item });
});

export default r;
