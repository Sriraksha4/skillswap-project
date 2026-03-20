import { FiUser, FiMail, FiCalendar, FiAward, FiArrowLeft, FiEdit2, FiCheck, FiX, FiPhone, FiCamera } from "react-icons/fi"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import "./Profile.css"

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const currentUser = JSON.parse(localStorage.getItem("user")) || {}
  const isOwnProfile = !userId || parseInt(userId) === currentUser.id

  useEffect(() => {
    setLoading(true)
    if (isOwnProfile) {
      setUserData(currentUser)
      setBio(currentUser.bio || "")
      setPhone(currentUser.phone || "")
      setAvatar(currentUser.avatar || "")
      // Fetch current user's skills
      axios
        .get(`http://localhost:5000/userSkills/${currentUser.id}`)
        .then((res) => {
          setUserSkills(res.data || [])
        })
        .catch((err) => {
          console.error("Error fetching skills:", err)
          setUserSkills([])
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      // Fetch other user's data
      axios
        .get(`http://localhost:5000/user/${userId}`)
        .then((res) => {
          setUserData(res.data)
          setBio(res.data.bio || "")
          setPhone(res.data.phone || "")
          setAvatar(res.data.avatar || "")
          setUserSkills(res.data.skills || [])
        })
        .catch((err) => {
          console.error("Error fetching user:", err)
          setUserData(null)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [userId, isOwnProfile, currentUser.id])

  const saveProfile = () => {
    if (isOwnProfile) {
      setIsSaving(true)
      const updatedUser = { ...currentUser, bio, phone, avatar }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      // Dispatch custom event to notify other components of user data change
      window.dispatchEvent(new Event("userDataUpdated"))
      
      axios
        .put(`http://localhost:5000/user/${currentUser.id}`, { bio, phone, avatar })
        .then(() => {
          setUserData(updatedUser)
          setIsEditing(false)
          alert("Profile updated successfully!")
        })
        .catch((err) => {
          console.error("Error saving profile:", err)
          alert("Failed to update profile. Please try again.")
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  const cancelEditing = () => {
    setBio(userData?.bio || "")
    setPhone(userData?.phone || "")
    setAvatar(userData?.avatar || "")
    setIsEditing(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return <div className="profile-container"><p>Loading profile...</p></div>
  }

  if (!userData) {
    return <div className="profile-container"><p>User not found</p></div>
  }

  const profileCompleteness = 70

  return (
    <div className="profile-container">
      {!isOwnProfile && (
        <div className="profile-back-btn">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
            Back
          </button>
        </div>
      )}
      
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-content">
          <div className="profile-avatar-container">
            {isEditing ? (
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatar ? (
                    <img src={avatar} alt="Preview" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <label className="avatar-upload-label">
                  <FiCamera size={16} />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
            ) : (
              <div className="profile-avatar">
                {avatar ? (
                  <img src={avatar} alt={userData.name} className="avatar-image" />
                ) : (
                  userData.name ? userData.name.charAt(0).toUpperCase() : "U"
                )}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name || "User"}</h1>
            <p className="profile-email">
              <FiMail size={16} /> {userData.email || "user@example.com"}
            </p>
          </div>
          {isOwnProfile && (
            <button 
              className={`edit-profile-btn ${isEditing ? 'editing' : ''}`}
              onClick={() => isEditing ? null : setIsEditing(true)}
            >
              <FiEdit2 size={16} />
              {isEditing ? 'Editing...' : 'Edit Profile'}
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        {/* Main Info Card */}
        <div className="profile-card info-card">
          <h3 className="card-title">Account Information</h3>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  value={userData.name} 
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  value={userData.email} 
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="250"
                  className="form-textarea"
                />
                <span className="char-count">{bio.length}/250</span>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={saveProfile}
                  disabled={isSaving}
                >
                  <FiCheck size={16} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-row">
                <div className="info-label">
                  <FiUser size={18} />
                  <span>Name</span>
                </div>
                <p className="info-value">{userData.name || "Not provided"}</p>
              </div>

              <div className="divider"></div>

              <div className="info-row">
                <div className="info-label">
                  <FiMail size={18} />
                  <span>Email</span>
                </div>
                <p className="info-value">{userData.email || "Not provided"}</p>
              </div>

              <div className="divider"></div>

              <div className="info-row">
                <div className="info-label">
                  <FiPhone size={18} />
                  <span>Phone</span>
                </div>
                <p className="info-value">{userData.phone || "Not provided"}</p>
              </div>

              <div className="divider"></div>

              <div className="info-row">
                <div className="info-label">
                  <FiCalendar size={18} />
                  <span>Member Since</span>
                </div>
                <p className="info-value">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {(userData.bio || isOwnProfile) && (
                <>
                  <div className="divider"></div>
                  <div className="info-row">
                    <div className="info-label">Bio</div>
                    <p className="info-value">{userData.bio || "Not provided"}</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Stats Card */}
        <div className="profile-card stats-card">
          <h3 className="card-title">
            {isOwnProfile ? "Your Statistics" : `${userData.name}'s Statistics`}
          </h3>
          
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-details">
              <p className="stat-value">
                {userSkills.filter((s) => s.skill_type === "teach").length}
              </p>
              <p className="stat-label">Skills Teaching</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-details">
              <p className="stat-value">
                {userSkills.filter((s) => s.skill_type === "learn").length}
              </p>
              <p className="stat-label">Skills Learning</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🤝</div>
            <div className="stat-details">
              <p className="stat-value">0</p>
              <p className="stat-label">Connections Made</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      {userSkills.length > 0 && (
        <div className="profile-card skills-card">
          <h3 className="card-title">Skills</h3>
          <div className="skills-list">
            {userSkills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-type">
                  {skill.skill_type === "teach" ? "Teaching" : "Learning"}
                </span>
                <span className="skill-name">{skill.skill_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwnProfile && (
        <>
          {/* Profile Completeness */}
          <div className="profile-card completeness-card">
            <div className="completeness-header">
              <h3 className="card-title">
                <FiAward size={20} />
                Profile Completeness
              </h3>
              <span className="completeness-percentage">{profileCompleteness}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>

            <div className="completeness-items">
              <div className="completeness-item completed">
                <span className="checkmark">✓</span>
                <span>Basic Information</span>
              </div>
              <div className="completeness-item completed">
                <span className="checkmark">✓</span>
                <span>Email Verified</span>
              </div>
              <div className="completeness-item pending">
                <span className="dot">●</span>
                <span>Add Bio</span>
              </div>
              <div className="completeness-item pending">
                <span className="dot">●</span>
                <span>Upload Avatar</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="profile-card tips-card">
            <h3 className="card-title">💡 Tips to Improve Your Profile</h3>
            <ul className="tips-list">
              <li>Add a profile picture to increase trust and connections</li>
              <li>Write a bio describing your interests and expertise</li>
              <li>Add at least 3 skills to get better matching recommendations</li>
              <li>Complete your profile to unlock premium features</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
