import {Link,useNavigate} from "react-router-dom"

function Navbar(){

const navigate=useNavigate()

const logout=()=>{
 localStorage.clear()
 navigate("/")
}

return(

<div style={{background:"#333",color:"white",padding:"10px"}}>

<Link to="/dashboard">Dashboard</Link> |
<Link to="/addskill">Add Skill</Link> |
<Link to="/skills">View Skills</Link> |
<Link to="/match">Match Skills</Link> |
<Link to="/profile">Profile</Link> |
<button onClick={logout}>Logout</button>

</div>

)

}

export default Navbar