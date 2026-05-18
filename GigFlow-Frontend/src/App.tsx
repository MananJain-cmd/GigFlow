import { useState, useEffect } from "react"
import Login from "./login"
import Dashboard from "./dashboard"

function App() {
  const [token, setToken] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)
  
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--text-primary)'
          }}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Dashboard token={token} setToken={setToken} />
      )}
    </div>
  )
}

export default App
