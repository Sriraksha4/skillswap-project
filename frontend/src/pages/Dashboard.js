import { Link } from "react-router-dom"
import { FiPlus, FiBook, FiZap, FiTrendingUp } from "react-icons/fi"
import { useState, useEffect } from "react"
import "./Dashboard.css"

// Animated Counter Component
function AnimatedCounter({ target, duration = 1000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const actions = [
    {
      icon: <FiPlus size={32} />,
      title: "Add a Skill",
      description: "Share what you know. Teach others!",
      link: "/addskill",
      color: "primary",
    },
    {
      icon: <FiBook size={32} />,
      title: "Browse Skills",
      description: "Explore skills available in our community",
      link: "/skills",
      color: "secondary",
    },
    {
      icon: <FiZap size={32} />,
      title: "Find a Match",
      description: "Connect with people who can help you learn",
      link: "/match",
      color: "accent",
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: "Your Profile",
      description: "View and manage your skills & achievements",
      link: "/profile",
      color: "success",
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user.name?.split(" ")[0]}! 👋</h1>
        <p className="dashboard-subtitle">
          Ready to learn and share? Pick what you'd like to do today.
        </p>
      </div>

      <div className="dashboard-grid">
        {actions.map((action, index) => (
          <Link to={action.link} key={index} style={{ textDecoration: "none" }}>
            <div className={`action-card action-card-${action.color}`}>
              <div className="action-icon">{action.icon}</div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
              <span className="action-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter target={0} />
          </div>
          <div className="stat-label">Skills Shared</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter target={0} />
          </div>
          <div className="stat-label">Skills Learning</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter target={0} />
          </div>
          <div className="stat-label">Connections</div>
        </div>
      </div>

      <div className="dashboard-tips">
        <h3 className="tips-title">💡 Getting Started Tips</h3>
        <ul className="tips-list">
          <li>Add a skill you're good at to help others learn</li>
          <li>Browse available skills and find what interests you</li>
          <li>Use the matching feature to find compatible learning partners</li>
          <li>Build your profile to showcase your expertise</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard

