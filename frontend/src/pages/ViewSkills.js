import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FiBook, FiUser, FiArrowRight, FiLoader, FiSearch, FiHeart, FiTrash2, FiMessageCircle } from "react-icons/fi"
import { useToast } from "../components/Toast"
import "./ViewSkills.css"

function ViewSkills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState("all") // "all" or "my"
  const [deleting, setDeleting] = useState(null)
  const { showToast } = useToast()

  const user = JSON.parse(localStorage.getItem("user")) || {}

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:5000/skills")
      .then((res) => {
        console.log("Skills loaded:", res.data)
        setSkills(res.data || [])
      })
      .catch((err) => {
        console.error("Error fetching skills:", err)
        showToast("Error loading skills", "error")
        setSkills([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const toggleFavorite = (skillId) => {
    setFavorites((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }

  const deleteSkill = async (skillId) => {
    console.log("Delete button clicked for skill ID:", skillId, "Type:", typeof skillId)
    
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return
    }

    setDeleting(skillId)
    try {
      console.log("Sending DELETE request to: http://localhost:5000/skill/" + skillId)
      const response = await axios.delete(`http://localhost:5000/skill/${skillId}`)
      console.log("Delete response:", response.data)
      console.log("Response status:", response.status)
      
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId))
      showToast("Skill deleted successfully", "success")
    } catch (error) {
      console.error("Error deleting skill:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error message:", error.message)
      showToast(error.response?.data?.message || "Failed to delete skill", "error")
    } finally {
      setDeleting(null)
    }
  }

  const getFilteredSkills = () => {
    let filtered = skills
    
    if (activeTab === "my") {
      filtered = skills.filter((skill) => skill.user_id === user.id)
    }

    return filtered.filter(
      (skill) =>
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.learn_skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredSkills = getFilteredSkills()

  return (
    <div className="view-skills-container">
      <div className="view-skills-header">
        <FiBook className="header-icon" />
        <h1>Skills Marketplace</h1>
        <p>Browse and discover skills from our community</p>
      </div>

      {/* Tabs */}
      <div className="skills-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Skills
        </button>
        <button
          className={`tab-btn ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Skills
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search skills... (e.g., React, Photography, Guitar)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <span className="search-result-count">
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner-icon" />
          <p>Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>
            {activeTab === "my"
              ? "You haven't added any skills yet"
              : searchTerm
              ? `No skills match "${searchTerm}"`
              : "No Skills Available Yet"}
          </h3>
          <p>
            {activeTab === "my"
              ? "Start by adding a skill to share with the community!"
              : searchTerm
              ? "Try searching for different keywords"
              : "Be the first to add a skill to the community!"}
          </p>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="skill-header">
                <div className="skill-avatar">
                  {skill.user_name ? skill.user_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="skill-meta">
                  <p className="skill-user">{skill.user_name || "User"}</p>
                  <span className={`skill-badge skill-badge-${skill.skill_type}`}>
                    {skill.skill_type === "teach" ? "Teaching" : "Learning"}
                  </span>
                </div>
                <div className="skill-actions">
                  {skill.user_id === user.id && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteSkill(skill.id)}
                      disabled={deleting === skill.id}
                      title="Delete skill"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                  {skill.user_id !== user.id && (
                    <>
                      <button
                        className="message-btn"
                        onClick={() => navigate(`/messages/${skill.user_id}`)}
                        title="Send message"
                      >
                        <FiMessageCircle size={18} />
                      </button>
                      <button
                        className={`favorite-btn ${favorites.includes(skill.id) ? "active" : ""}`}
                        onClick={() => toggleFavorite(skill.id)}
                        title="Add to favorites"
                      >
                        <FiHeart size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="skill-body">
                <div className="skill-section">
                  <p className="skill-label">Teaches:</p>
                  <h3 className="skill-name">{skill.skill_name}</h3>
                </div>

                <div className="skill-divider"></div>

                <div className="skill-section">
                  <p className="skill-label">Wants to Learn:</p>
                  <h3 className="skill-learn">{skill.learn_skill}</h3>
                </div>
              </div>

              {skill.user_id !== user.id && (
                <div className="skill-footer">
                  <button 
                    className="skill-action-btn"
                    onClick={() => navigate(`/profile/${skill.user_id}`)}
                    title="View user profile"
                  >
                    <FiUser size={16} />
                    View Profile
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

export default ViewSkills

