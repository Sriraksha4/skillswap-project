import {useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import "../styles.css"

function Register(){

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [msg,setMsg]=useState("")

const register=()=>{

axios.post("http://localhost:5000/register",{name,email,password})
.then(res=>{
setMsg(res.data)
})

}

return(

<div className="card">

<h1>🎓 Join SkillSwap</h1>

<p className="quote">
"Knowledge grows when shared."
</p>

<input placeholder="👤 Name" onChange={(e)=>setName(e.target.value)}/>

<input placeholder="📧 Email" onChange={(e)=>setEmail(e.target.value)}/>

<input type="password" placeholder="🔑 Password" onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={register}>Register</button>

<p>{msg}</p>

<p>Already registered? <Link to="/">Login</Link></p>

</div>

)

}

export default Register