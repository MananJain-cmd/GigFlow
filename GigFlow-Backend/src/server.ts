import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./Database/db"
import authRoutes from "./routes/authroutes"
import leadRoutes from "./routes/leadroutes"
import { protect } from "./middlewares/middleware"
dotenv.config()
connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/leads", leadRoutes)
app.get("/", (req: Request, res: Response) => {
  res.send("API is currently running")
})
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Authentication successful" })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})