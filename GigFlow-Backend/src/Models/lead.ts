import mongoose, { Document } from "mongoose"
export interface ILead extends Document {
  name: string
  email: string
  status: "New" | "Contacted" | "Qualified" | "Lost"
  source: "Website" | "Instagram" | "Referral"
  createdAt: Date
}
const leadSchema = new mongoose.Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },
  },
  { timestamps: true } 
)
export const Lead = mongoose.model<ILead>("Lead", leadSchema)