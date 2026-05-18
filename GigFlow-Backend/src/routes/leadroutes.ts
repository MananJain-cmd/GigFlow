import express from "express"
import { createLead } from "../Functions/leadfunctions"
import { protect } from "../middlewares/middleware"
import { getLeads } from "../Functions/leadfunctions"
import { updateLead } from "../Functions/leadfunctions"
import { getSingleLead } from "../Functions/leadfunctions"
import { exportLeads } from "../Functions/leadfunctions"
import { deleteLead } from "../Functions/leadfunctions"
const router = express.Router()
router.get("/export", protect, exportLeads)
router.get("/", protect, getLeads)
router.post("/", protect, createLead)
router.put("/:id", protect, updateLead)
router.get("/:id", protect, getSingleLead)
router.delete("/:id", protect, deleteLead)
export default router