import { Request, Response } from "express"
import { Lead } from "../Models/lead"
export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, status, source } = req.body
    const lead = await Lead.create({
      name,
      email,
      status,
      source,
    })
    res.status(201).json(lead)
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}
export const getLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search, sort, page = 1 } = req.query

    const query: any = {}
    if (status) {
      query.status = status
    }
    if (source) {
      query.source = source
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ]
    }
    const limit = 10
    const skip = (Number(page) - 1) * limit
    let sortOption: any = { createdAt: -1 } // latest default
    if (sort === "oldest") {
      sortOption = { createdAt: 1 }
    }
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
    const total = await Lead.countDocuments(query)
    res.json({
      leads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("GET LEADS ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" })
    }
    res.json(updatedLead)
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const lead = await Lead.findByIdAndDelete(id)

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    res.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}
export const getSingleLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const lead = await Lead.findById(id)

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    res.json(lead)
  } catch (error) {
    console.error("GET SINGLE LEAD ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const exportLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search } = req.query

    const query: any = {}
    if (status) {
      query.status = status
    }
    if (source) {
      query.source = source
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ]
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 })

    // Generate CSV
    const csvHeader = "ID,Name,Email,Status,Source,CreatedAt\n"
    const csvRows = leads.map(lead => {
      const name = `"${(lead.name || "").replace(/"/g, '""')}"`
      const email = `"${(lead.email || "").replace(/"/g, '""')}"`
      const status = `"${(lead.status || "").replace(/"/g, '""')}"`
      const source = `"${(lead.source || "").replace(/"/g, '""')}"`
      const createdAt = `"${lead.createdAt ? new Date(lead.createdAt).toISOString() : ""}"`
      return `${lead._id},${name},${email},${status},${source},${createdAt}`
    }).join("\n")

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
    res.status(200).send(csvHeader + csvRows)
  } catch (error) {
    console.error("EXPORT LEADS ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}