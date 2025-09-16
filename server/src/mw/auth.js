import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization?.split(" ")[1];
  const token = header || req.cookies?.token;
  if (!token) return res.status(401).json({ error: "no token" });
  try {
    req.uid = jwt.verify(token, process.env.JWT_SECRET).uid;
    next();
  } catch {
    res.status(401).json({ error: "bad token" });
  }
}
