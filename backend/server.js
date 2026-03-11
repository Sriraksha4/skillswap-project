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

db.query("SELECT * FROM skills",(err,result)=>{
 if(err) return res.send(err)
 res.send(result)
})

})



// ================= SKILL MATCH =================

app.get("/match",(req,res)=>{

const query = `
SELECT 
u1.name AS learner,
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
app.listen(5000,()=>{
console.log("Server running on port 5000")
})