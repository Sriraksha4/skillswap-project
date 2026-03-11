import {useState} from "react"
import axios from "axios"
import {useNavigate, Link} from "react-router-dom"
import "../styles.css"

function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [msg,setMsg]=useState("")

const navigate = useNavigate()

const login = () => {

axios.post("http://localhost:5000/login",{
 email:email,
 password:password
})
.then(res=>{

if(res.data.id){

localStorage.setItem("user",JSON.stringify(res.data))

navigate("/dashboard")

}else{

setMsg(res.data)

}

})

}

return(

<div className="card">

<h1 className="title">🚀 SkillSwap</h1>

<p className="quote">
"Share knowledge. Learn new skills."
</p>

<h2>🔐 Login</h2>

<input
placeholder="📧 Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="🔑 Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

<p className="error">{msg}</p>

<p>New user? <Link to="/register">Register here</Link></p>

</div>

)

}

export default Login