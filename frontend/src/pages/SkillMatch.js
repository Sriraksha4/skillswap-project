import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FiZap, FiMail, FiArrowRight, FiLoader, FiMessageCircle } from "react-icons/fi"
import "./SkillMatch.css"

function SkillMatch() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:5000/match")
      .then((res) => {
        setMatches(res.data || [])
      })
      .catch((err) => {
        console.error("Error fetching matches:", err)
        setMatches([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleConnect = (match) => {
    // Redirect to teacher's profile page
    navigate(`/profile/${match.teacher_id}`)
  }

  const handleMessage = (match) => {
    // Redirect to messaging page with teacher
    navigate(`/messages/${match.teacher_id}`)
  }

  return (
    <div className="match-container">
      <div className="match-header">
        <FiZap className="header-icon" />
        <h1>Find Your Perfect Match</h1>
        <p>Connect with people who can teach you and learn from you</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner-icon" />
          <p>Finding your perfect matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h3>No Matches Yet</h3>
          <p>Add more skills to find matching partners in the community!</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match, index) => (
            <div key={index} className="match-card">
              <div className="match-badge">Matched!</div>
              
              <div className="match-content">
                <div className="match-section teacher-section">
                  <div className="teacher-avatar">👩‍🏫</div>
                  <div className="teacher-info">
                    <p className="section-label">Your Teacher</p>
                    <h3 className="teacher-name">{match.teacher || "Community Member"}</h3>
                    <p className="teaching-skill">
                      Teaches:
                      <span className="highlight teach">
                        {match.skill_you_want}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="match-arrow">
                  <FiArrowRight size={24} />
                </div>

                <div className="match-section learner-section">
                  <div className="learner-avatar">👤</div>
                  <div className="learner-info">
                    <p className="section-label">You Want to Learn</p>
                    <p className="highlight learn">
                      {match.skill_you_want}
                    </p>
                  </div>
                </div>
              </div>

              {match.teacher_email && (
                <div className="match-footer">
                  <button 
                    className="contact-btn profile-btn"
                    onClick={() => handleConnect(match)}
                    title="View full profile"
                  >
                    <FiMail size={16} />
                    View Profile
                  </button>
                  <button 
                    className="contact-btn message-btn"
                    onClick={() => handleMessage(match)}
                    title="Send message"
                  >
                    <FiMessageCircle size={16} />
                    Message
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillMatch
