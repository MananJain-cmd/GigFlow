import { useEffect, useState } from "react"

interface Lead {
  _id: string;
  name: string;
  status: string;
  email?: string;
  source?: string;
}

const Dashboard = ({ token, setToken }: any) => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [newLead, setNewLead] = useState({ name: "", email: "", status: "New", source: "" })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [source, setSource] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])
  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, source, token])
  const fetchLeads = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `http://localhost:5000/api/leads?search=${debouncedSearch}&status=${status}&source=${source}`,
        {
          headers: { Authorization: token },
        })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch leads")
      }

      setLeads(data.leads || [])
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching leads")
      if (err.message.includes("token") || err.message.includes("unauthorized")) {
        setToken("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLead.name) {
      setCreateError("Name is required")
      return
    }

    setCreating(true)
    setCreateError("")

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newLead),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to create lead")
      }

      // Add the new lead to the top of the list
      setLeads([data, ...leads])

      // Reset form and close modal
      setNewLead({ name: "", email: "", status: "New", source: "" })
      setIsModalOpen(false)
    } catch (err: any) {
      setCreateError(err.message || "An error occurred while creating lead")
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    setToken("")
  }

  const handleExportCSV = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/leads/export?search=${debouncedSearch}&status=${status}&source=${source}`,
        { headers: { Authorization: token } }
      )
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "leads.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.message || "Failed to export CSV")
    }
  }

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsModalOpen(true)
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to delete lead")
      }

      setLeads(leads.filter((l: Lead) => l._id !== leadId))
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting lead")
    }
  }

  const getStatusClass = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("new")) return "new"
    if (s.includes("contacted")) return "contacted"
    if (s.includes("closed") || s.includes("won")) return "closed"
    return "default"
  }

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <div>
          <h2>Leads Overview</h2>
          <p>Manage and track your active leads</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Lead
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="filters-section" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input-field"
          style={{ flex: 1, minWidth: "200px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field"
          style={{ width: "auto" }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </select>
        <select
          className="input-field"
          style={{ width: "auto" }}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="center-flex" style={{ minHeight: "50vh" }}>
          <div className="spinner" style={{ width: "3rem", height: "3rem", borderColor: "rgba(255,255,255,0.1)", borderTopColor: "var(--accent-primary)" }}></div>
        </div>
      ) : leads?.length === 0 ? (
        <div className="empty-state">
          <h3>No leads found</h3>
          <p>You don't have any leads assigned to you yet.</p>
          <button className="btn btn-primary" style={{ marginTop: "1rem", width: "auto" }} onClick={() => setIsModalOpen(true)}>
            Add Your First Lead
          </button>
        </div>
      ) : (
        <div className="leads-grid">
          {leads?.map((lead: Lead) => (
            <div className="lead-card" key={lead._id || Math.random().toString()}>
              <div className="lead-name">{lead.name || "Unknown Lead"}</div>
              {lead.email && <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{lead.email}</p>}
              {lead.source && <p style={{ fontSize: "0.875rem", marginBottom: "1rem", color: "var(--text-muted)" }}>Source: {lead.source}</p>}

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`status-badge ${getStatusClass(lead.status)}`}>
                  {lead.status || "Unassigned"}
                </span>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                    onClick={() => handleViewDetails(lead)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                    onClick={() => handleDeleteLead(lead._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem" }}>Add New Lead</h3>

            {createError && <div className="alert alert-error">{createError}</div>}

            <form onSubmit={handleCreateLead}>
              <div className="input-group">
                <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Name *</label>
                <input
                  className="input-field"
                  placeholder="John Doe"
                  value={newLead.name}
                  onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Email</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="john@example.com"
                  value={newLead.email}
                  onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Status</label>
                <select
                  className="input-field"
                  value={newLead.status}
                  onChange={e => setNewLead({ ...newLead, status: e.target.value })}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Source</label>
                <input
                  className="input-field"
                  placeholder="e.g. Website, Referral, LinkedIn"
                  value={newLead.source}
                  onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating} style={{ width: "auto" }}>
                  {creating ? <span className="spinner" style={{ width: "1rem", height: "1rem" }}></span> : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedLead && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem" }}>Lead Details</h3>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Name</label>
              <p style={{ fontSize: "1.125rem", fontWeight: "600" }}>{selectedLead.name}</p>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Email</label>
              <p>{selectedLead.email || "N/A"}</p>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Status</label>
              <p>
                <span className={`status-badge ${getStatusClass(selectedLead.status)}`}>
                  {selectedLead.status || "Unassigned"}
                </span>
              </p>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Source</label>
              <p>{selectedLead.source || "N/A"}</p>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard