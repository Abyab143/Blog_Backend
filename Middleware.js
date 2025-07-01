import jwt from "jsonwebtoken";


export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, jwtSecret); // Same secret key
    req.user = decoded; // this makes req.user = { userId: ... }
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
