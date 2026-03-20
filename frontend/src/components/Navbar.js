import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiHome, FiPlus, FiBook, FiZap, FiUser, FiLogOut, FiSettings } from "react-icons/fi"
import { useState, useEffect } from "react"
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {})

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user")) || {}
      setUser(updatedUser)
    }

    window.addEventListener("userDataUpdated", handleStorageChange)
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("userDataUpdated", handleStorageChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      {/* Header */}
      <div className="navbar-header">
        <span className="navbar-logo">✨</span>
        <p className="navbar-title">SkillSwap</p>
      </div>

      {/* Navigation Items */}
      <div className="navbar-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/addskill"
          className={`nav-item ${isActive("/addskill") ? "active" : ""}`}
        >
          <FiPlus className="nav-icon" />
          <span>Add Skill</span>
        </Link>

        <Link
          to="/skills"
          className={`nav-item ${isActive("/skills") ? "active" : ""}`}
        >
          <FiBook className="nav-icon" />
          <span>View Skills</span>
        </Link>

        <Link
          to="/match"
          className={`nav-item ${isActive("/match") ? "active" : ""}`}
        >
          <FiZap className="nav-icon" />
          <span>Find Match</span>
        </Link>

        <Link
          to="/profile"
          className={`nav-item ${isActive("/profile") ? "active" : ""}`}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </Link>
      </div>

      {/* User Section */}
      <div className="navbar-user">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="avatar-image" />
          ) : (
            user.name ? user.name.charAt(0).toUpperCase() : "U"
          )}
        </div>
        <div className="user-info">
          <p className="user-name">{user.name?.split(" ")[0] || "User"}</p>
          <p className="user-email">{user.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="nav-item logout-btn" onClick={logout}>
        <FiLogOut className="nav-icon" />
        <span>Logout</span>
      </button>
    </nav>
  )
}

export default Navbar