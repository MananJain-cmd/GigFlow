import mongoose, { Document } from "mongoose"
export interface IUser extends Document {
  email: string
  password: string
  role: "admin" | "sales"
}
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "sales"],
    default: "sales"
  }
})

export const User = mongoose.model<IUser>("User", userSchema)