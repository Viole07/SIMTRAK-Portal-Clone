import { Router } from "express";
import Journal from "../models/Journal.js";
import auth from "../mw/auth.js";

const r = Router();

r.get("/", auth, async (req,res)=> {
  const items = await Journal.find({ userId: req.uid }).sort({ createdAt: -1 });
  res.json({ items });
});

r.post("/", auth, async (req,res)=> {
  const item = await Journal.create({ userId: req.uid, ...req.body });
  res.json({ item });
});

export default r;
