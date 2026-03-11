import { useEffect, useState } from "react"
import axios from "axios"
import "../styles.css"

function Match(){

const [matches,setMatches] = useState([])

useEffect(()=>{

axios.get("http://localhost:5000/match")
.then(res=>{
setMatches(res.data)
})

},[])

return(

<div className="card">

<h1>🤝 Skill Matches</h1>

<p className="quote">
"Learning is better when we learn together."
</p>

{matches.length === 0 ? (

<p style={{color:"gray"}}>
😔 No matches yet. Add more skills!
</p>

) : (

matches.map((m,index)=>(
<div key={index} className="match-card">

<h3>🎉 Hurray {m.learner}!</h3>

<p>👩‍🏫 {m.teacher} can teach you <b>{m.skill_you_want}</b></p>

<p>📧 Contact: {m.teacher_email}</p>

</div>
))

)}

</div>

)

}

export default Match