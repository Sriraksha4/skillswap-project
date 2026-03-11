import {useEffect,useState} from "react"
import axios from "axios"
import "../styles.css"

function ViewSkills(){

const [skills,setSkills]=useState([])

useEffect(()=>{

axios.get("http://localhost:5000/skills")
.then(res=>{
setSkills(res.data)
})

},[])

return(

<div>

<h1 style={{textAlign:"center",color:"white"}}>
📚 Skills Shared
</h1>

{skills.map((s)=>(
<div key={s.id} className="match-card">

<p>👤 User ID: {s.user_id}</p>
<p>💡 Teaches: {s.skill_name}</p>
<p>📖 Wants to learn: {s.learn_skill}</p>

</div>
))}

</div>

)

}

export default ViewSkills