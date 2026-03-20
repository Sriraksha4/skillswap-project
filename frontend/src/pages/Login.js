import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi"
import "./Auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async () => {
    if (!email || !password) {
      setMsg("Please fill in all fields")
      setMsgType("error")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      })

      if (res.data.id) {
        localStorage.setItem("user", JSON.stringify(res.data))
        setMsg("Login successful! Redirecting...")
        setMsgType("success")
        setTimeout(() => navigate("/dashboard"), 1500)
      } else {
        setMsg(res.data)
        setMsgType("error")
      }
    } catch (error) {
      setMsg("Connection error. Please try again.")
      setMsgType("error")
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") login()
  }

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <h1 className="auth-sidebar-title">Welcome Back!</h1>
          <p className="auth-sidebar-text">
            Connect with skilled individuals, learn new expertise, and grow together.
          </p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🎓</span>
              <p>Learn New Skills</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <p>Connect & Teach</p>
            </div>
            <div className="feature">
              <span className="feature-icon">⭐</span>
              <p>Grow Together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Access your SkillSwap account</p>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
              />
            </div>
          </div>

          {msg && (
            <div className={`message message-${msgType}`}>
              {msgType === "error" ? (
                <FiAlertCircle className="message-icon" />
              ) : (
                <FiCheckCircle className="message-icon" />
              )}
              <span>{msg}</span>
            </div>
          )}

          <button
            className="btn-primary btn-block"
            onClick={login}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight size={18} />
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>New to SkillSwap?</span>
          </div>

          <Link to="/register" style={{ textDecoration: "none" }}>
            <button className="btn-secondary btn-block">
              Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login