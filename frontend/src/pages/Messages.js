import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { FiSend, FiArrowLeft, FiLoader, FiMessageCircle } from "react-icons/fi"
import { useToast } from "../components/Toast"
import "./Messages.css"

function Messages() {
  const { userId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState(null)
  const { showToast } = useToast()

  const currentUser = JSON.parse(localStorage.getItem("user")) || {}

  useEffect(() => {
    if (!userId) return

    // Fetch other user details
    axios
      .get(`http://localhost:5000/user/${userId}`)
      .then((res) => {
        setOtherUser(res.data)
      })
      .catch((err) => {
        console.error("Error fetching user:", err)
        showToast("Error loading user information", "error")
      })

    // Fetch messages
    fetchMessages()

    // Refresh messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchMessages = () => {
    if (!userId) return

    setLoading(true)
    axios
      .get(`http://localhost:5000/messages/${currentUser.id}/${userId}`)
      .then((res) => {
        setMessages(res.data || [])
        // Auto scroll to bottom
        setTimeout(() => {
          const messagesContainer = document.getElementById("messages-container")
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight
          }
        }, 100)
      })
      .catch((err) => {
        console.error("Error fetching messages:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) {
      showToast("Message cannot be empty", "error")
      return
    }

    console.log("Sending message:", {
      sender_id: currentUser.id,
      receiver_id: parseInt(userId),
      message: newMessage,
    })

    setSending(true)
    try {
      const response = await axios.post("http://localhost:5000/sendMessage", {
        sender_id: currentUser.id,
        receiver_id: parseInt(userId),
        message: newMessage,
      })

      console.log("Message sent successfully:", response.data)
      if (response.data.success) {
        setNewMessage("")
        fetchMessages()
        showToast("Message sent!", "success")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error message:", error.message)
      showToast(error.response?.data?.message || "Failed to send message", "error")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="messages-page">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar} alt={otherUser.name} className="avatar-image" />
            ) : (
              otherUser?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="chat-user-details">
            <h2>{otherUser?.name || "User"}</h2>
            <p>{otherUser?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div id="messages-container" className="messages-container">
          {loading && messages.length === 0 ? (
            <div className="loading-state">
              <FiLoader className="spinner-icon" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <FiMessageCircle className="empty-icon" />
              <h3>Start a conversation!</h3>
              <p>Send your first message to connect and discuss skills</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender_id === currentUser.id ? "sent" : "received"}`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{msg.message}</p>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="message-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={sending}
            maxLength={1000}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={sending || !newMessage.trim()}
            title="Send message"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Messages
