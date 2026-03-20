import { useState } from "react"
import axios from "axios"
import { FiZap, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import { useToast } from "../components/Toast"
import "./AddSkill.css"

function AddSkill() {
  const [teach, setTeach] = useState("")
  const [learn, setLearn] = useState("")
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const user = JSON.parse(localStorage.getItem("user")) || {}

  const addSkill = async () => {
    if (!teach || !learn) {
      showToast("Please fill in all fields", "error")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/addSkill", {
        user_id: user.id,
        skill_name: teach,
        learn_skill: learn,
      })

      showToast("Skill added successfully! 🎉", "success", 3000)
      setTeach("")
      setLearn("")
    } catch (error) {
      showToast("Error adding skill. Please try again.", "error")
    }
    setLoading(false)
  }

  return (
    <div className="add-skill-container">
      <div className="add-skill-header">
        <FiZap className="header-icon" />
        <h1>Share Your Skill</h1>
        <p>Help others learn what you're good at!</p>
      </div>

      <div className="add-skill-card">
        <div className="form-section">
          <h3 className="section-title">What Can You Teach?</h3>
          <p className="section-helper">Share a skill you're confident in teaching others</p>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="e.g., React.js, Guitar, Photography"
              value={teach}
              onChange={(e) => setTeach(e.target.value)}
              className="form-input"
            />
            <span className="placeholder-hint">Be specific and clear about your skill</span>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">What Do You Want to Learn?</h3>
          <p className="section-helper">Tell us what skill you're interested in acquiring</p>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="e.g., Spanish, Web Design, Cooking"
              value={learn}
              onChange={(e) => setLearn(e.target.value)}
              className="form-input"
            />
            <span className="placeholder-hint">This helps us find the perfect match for you</span>
          </div>
        </div>

        <button
          className="btn-primary btn-block add-skill-btn"
          onClick={addSkill}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding Skill...
            </>
          ) : (
            <>
              Add Skill to Profile
            </>
          )}
        </button>

        <div className="tips-box">
          <h4>💡 Tips for Success</h4>
          <ul>
            <li>Choose skills you're passionate about teaching</li>
            <li>Be specific - "Photography" is better than "Art"</li>
            <li>The more detailed, the better matches you'll find</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddSkill

