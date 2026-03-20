import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi"
import "./Auth.css"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("")
  const [loading, setLoading] = useState(false)

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[!@#$%^&*]).{8,}$/
    return regex.test(pwd)
  }

  const register = async () => {
    if (!name || !email || !password) {
      setMsg("Please fill in all fields")
      setMsgType("error")
      return
    }

    if (!validatePassword(password)) {
      setMsg("Password must be 8+ chars with at least one special character (!@#$%^&*)")
      setMsgType("error")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      })

      if (res.data.includes("Successful")) {
        setMsg("Account created! Redirecting to login...")
        setMsgType("success")
        setTimeout(() => (window.location.href = "/"), 2000)
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
    if (e.key === "Enter") register()
  }

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <h1 className="auth-sidebar-title">Join SkillSwap</h1>
          <p className="auth-sidebar-text">
            Start learning and sharing skills with our global community of learners and teachers.
          </p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <p>Get started in seconds</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <p>Your data is secure</p>
            </div>
            <div className="feature">
              <span className="feature-icon">✨</span>
              <p>Free forever</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join thousands of skill swappers</p>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
              />
            </div>
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
                placeholder="Min 8 chars + 1 special char (!@#$%^&*)"
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
            onClick={register}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <FiArrowRight size={18} />
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn-secondary btn-block">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
