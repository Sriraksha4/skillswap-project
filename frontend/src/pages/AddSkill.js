import {useState} from "react"
import axios from "axios"
import "../styles.css"

function AddSkill(){

const [teach,setTeach]=useState("")
const [learn,setLearn]=useState("")
const [msg,setMsg]=useState("")

const user = JSON.parse(localStorage.getItem("user"))

const addSkill=()=>{

axios.post("http://localhost:5000/addSkill",{

user_id:user.id,
skill_name:teach,
learn_skill:learn

}).then(res=>{
setMsg("🎉 Skill Added Successfully!")
})

}

return(

<div className="card">

<h1>💡 Share Your Skill</h1>

<p className="quote">
"Teaching others is the best way to master a skill."
</p>

<input
placeholder="🎯 Skill you can teach"
onChange={(e)=>setTeach(e.target.value)}
/>

<input
placeholder="📚 Skill you want to learn"
onChange={(e)=>setLearn(e.target.value)}
/>

<button onClick={addSkill}>Add Skill</button>

<p>{msg}</p>

</div>

)

}

export default AddSkill