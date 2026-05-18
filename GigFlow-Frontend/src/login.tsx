import { useState } from "react"

const Login = ({ setToken }: any) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("sales")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const endpoint = isLogin 
        ? "http://localhost:5000/api/auth/login" 
        : "http://localhost:5000/api/auth/register"
        
      const payload = isLogin ? { email, password } : { email, password, role }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || (isLogin ? "Invalid credentials" : "Registration failed"))
      }

      if (isLogin) {
        if (data.token) {
          setToken(data.token)
        } else {
          throw new Error("Invalid response from server")
        }
      } else {
        setSuccess("Registration successful! You can now log in.")
        setIsLogin(true) 
        setPassword("") 
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
  }

  return (
    <div className="center-flex" style={{ minHeight: "100vh" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2>{isLogin ? "Welcome Back" : "Create an Account"}</h2>
          <p>{isLogin ? "Sign in to manage your leads" : "Join GigFlow to track your prospects"}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              className="input-field"
              type="email"
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <input 
              className="input-field"
              placeholder="Password" 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          {!isLogin && (
            <div className="input-group">
              <select 
                className="input-field"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? <span className="spinner"></span> : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ fontSize: "0.875rem" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              onClick={toggleMode} 
              style={{ 
                background: "none", 
                border: "none", 
                color: "var(--accent-primary)", 
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "0.5rem",
                fontFamily: "inherit"
              }}
            >
              {isLogin ? "Sign up here" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login