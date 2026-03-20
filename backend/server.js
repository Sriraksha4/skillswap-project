const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

// ================= REGISTER =================

app.post("/register",(req,res)=>{

const {name,email,password} = req.body

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/

if(!emailRegex.test(email)){
 return res.send("Invalid email format")
}

if(!passwordRegex.test(password)){
 return res.send("Password must be 8 characters with one special character")
}

db.query(
"SELECT * FROM users WHERE email=?",
[email],
(err,result)=>{

 if(result.length > 0){
  return res.send("User already registered")
 }

 db.query(
 "INSERT INTO users(name,email,password) VALUES(?,?,?)",
 [name,email,password],
 (err,data)=>{
  if(err) return res.send(err)
  res.send("Registration Successful")
 })

})

})

// ================= LOGIN =================

app.post("/login",(req,res)=>{

const {email,password} = req.body

db.query(
"SELECT * FROM users WHERE email=?",
[email],
(err,result)=>{

 if(result.length == 0){
  return res.send("User not found. Please register")
 }

 if(result[0].password !== password){
  return res.send("Incorrect password")
 }

 res.send(result[0])

})

})

// ================= ADD SKILL =================

app.post("/addSkill",(req,res)=>{

const {user_id,skill_name,learn_skill} = req.body

db.query(
"INSERT INTO skills(user_id,skill_name,skill_type,learn_skill) VALUES(?,?,?,?)",
[user_id,skill_name,"teach",learn_skill],
(err,result)=>{
 if(err) return res.send(err)
 res.send("Skill Added Successfully")
})

})

// ================= VIEW SKILLS =================

app.get("/skills",(req,res)=>{

db.query(
  "SELECT s.*, u.name as user_name, u.email as user_email FROM skills s JOIN users u ON s.user_id = u.id",
  (err,result)=>{
    if(err) return res.send(err)
    res.send(result)
  }
)

})



// ================= SKILL MATCH =================

app.get("/match",(req,res)=>{

const query = `
SELECT 
u1.id AS learner_id,
u1.name AS learner,
u2.id AS teacher_id,
u2.name AS teacher,
u2.email AS teacher_email,
a.learn_skill AS skill_you_want
FROM skills a
JOIN skills b
ON a.learn_skill = b.skill_name
AND a.skill_name = b.learn_skill
JOIN users u1 ON a.user_id = u1.id
JOIN users u2 ON b.user_id = u2.id
WHERE a.user_id != b.user_id
`

db.query(query,(err,result)=>{
 if(err) return res.send(err)
 res.send(result)
})

})

// ================= GET USER BY ID =================

app.get("/user/:id",(req,res)=>{

const {id} = req.params

db.query(
"SELECT * FROM users WHERE id=?",
[id],
(err,result)=>{
 if(err) return res.send(err)
 if(result.length === 0) return res.send("User not found")
 res.send(result[0])
})

})

// ================= GET USER SKILLS =================

app.get("/userSkills/:userId",(req,res)=>{

const {userId} = req.params

db.query(
"SELECT * FROM skills WHERE user_id=?",
[userId],
(err,result)=>{
 if(err) return res.send(err)
 res.send(result || [])
})

})

// ================= DELETE SKILL =================

app.delete("/skill/:id", (req, res) => {
  const { id } = req.params

  console.log("DELETE request received for skill ID:", id)

  db.query(
    "DELETE FROM skills WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Database error deleting skill:", err)
        return res.status(500).json({ success: false, message: "Error deleting skill", error: err.message })
      }
      
      console.log("Delete result:", result)
      
      if (result.affectedRows === 0) {
        console.warn("No skill found with ID:", id)
        return res.status(404).json({ success: false, message: "Skill not found" })
      }
      
      console.log("Skill deleted successfully. Affected rows:", result.affectedRows)
      res.json({ success: true, message: "Skill deleted successfully", affectedRows: result.affectedRows })
    }
  )
})

// ================= UPDATE USER PROFILE =================

app.put("/user/:id", (req, res) => {
  const { id } = req.params
  const { bio, phone, avatar } = req.body

  // Build dynamic query based on provided fields
  let updateFields = []
  let updateValues = []

  if (bio !== undefined) {
    updateFields.push("bio = ?")
    updateValues.push(bio)
  }

  if (phone !== undefined) {
    updateFields.push("phone = ?")
    updateValues.push(phone)
  }

  if (avatar !== undefined) {
    updateFields.push("avatar = ?")
    updateValues.push(avatar)
  }

  if (updateFields.length === 0) {
    return res.status(400).send("No fields to update")
  }

  updateValues.push(id)

  const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`

  db.query(query, updateValues, (err, result) => {
    if (err) return res.status(500).send(err)
    
    // Fetch and return updated user data
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).send(err)
      if (result.length === 0) return res.status(404).send("User not found")
      res.send(result[0])
    })
  })
})

// ================= TEST ENDPOINT =================

app.get("/test", (req, res) => {
  res.json({ success: true, message: "Backend is working!" })
})

// ================= SEND MESSAGE =================

app.post("/sendMessage", (req, res) => {
  const { sender_id, receiver_id, message } = req.body

  console.log("Received message:", { sender_id, receiver_id, message })

  if (!sender_id || !receiver_id || !message) {
    console.error("Missing required fields:", { sender_id, receiver_id, message })
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      received: { sender_id, receiver_id, message },
    })
  }

  const timestamp = new Date()

  console.log("Inserting message into database...")
  db.query(
    "INSERT INTO messages(sender_id, receiver_id, message, timestamp, read_status) VALUES(?,?,?,?,?)",
    [sender_id, receiver_id, message, timestamp, false],
    (err, result) => {
      if (err) {
        console.error("Database error:", err)
        console.error("Error code:", err.code)
        console.error("Error message:", err.message)
        return res.status(500).json({
          success: false,
          message: "Error sending message: " + err.message,
          error: err.code,
        })
      }
      console.log("Message inserted successfully with ID:", result.insertId)
      res.json({ success: true, message: "Message sent successfully", id: result.insertId })
    }
  )
})

// ================= GET CONVERSATION =================

app.get("/messages/:userId/:otherUserId", (req, res) => {
  const { userId, otherUserId } = req.params

  const query = `
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp ASC
  `

  db.query(query, [userId, otherUserId, otherUserId, userId], (err, result) => {
    if (err) {
      console.error("Error fetching messages:", err)
      return res.status(500).send(err)
    }
    res.json(result || [])
  })
})

// ================= GET CONVERSATIONS LIST =================

app.get("/conversations/:userId", (req, res) => {
  const { userId } = req.params

  const query = `
    SELECT DISTINCT
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        ELSE sender_id 
      END as user_id,
      u.name,
      u.email,
      u.avatar,
      MAX(m.timestamp) as last_message_time,
      (SELECT message FROM messages WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?) ORDER BY timestamp DESC LIMIT 1) as last_message
    FROM messages m
    JOIN users u ON (
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END = u.id
    )
    WHERE sender_id = ? OR receiver_id = ?
    GROUP BY user_id
    ORDER BY last_message_time DESC
  `

  db.query(query, [userId, userId, userId, userId, userId, userId], (err, result) => {
    if (err) {
      console.error("Error fetching conversations:", err)
      return res.status(500).send(err)
    }
    res.json(result || [])
  })
})

// ================= MARK MESSAGE AS READ =================

app.put("/message/:messageId/read", (req, res) => {
  const { messageId } = req.params

  db.query(
    "UPDATE messages SET read_status = true WHERE id = ?",
    [messageId],
    (err, result) => {
      if (err) {
        console.error("Error updating message:", err)
        return res.status(500).send(err)
      }
      res.json({ success: true, message: "Message marked as read" })
    }
  )
})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})