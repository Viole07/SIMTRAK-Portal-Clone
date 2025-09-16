import { Router } from "express";
import Leave from "../models/Leave.js";
import auth from "../mw/auth.js";

const r = Router();

r.get("/", auth, async (req,res)=> {
  const items = await Leave.find({ userId: req.uid }).sort({ createdAt: -1 });
  res.json({ items });
});

r.post("/", auth, async (req,res)=> {
  const { from, joining, reason, handover } = req.body;
  const item = await Leave.create({
    userId: req.uid,
    from: new Date(from),
    joining: new Date(joining),
    reason,
    handover,
  });
  res.json({ item });
});

export default r;
