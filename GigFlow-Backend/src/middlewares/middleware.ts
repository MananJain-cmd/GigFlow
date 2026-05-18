import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
export interface AuthRequest extends Request {
  user?: any
}
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}