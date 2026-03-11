import {Link} from "react-router-dom"
import "../styles.css"

function Dashboard(){

const user = JSON.parse(localStorage.getItem("user"))

return(

<div className="card">

<h1>👋 Hi {user?.name}</h1>

<p className="quote">
"What skill will you master today?"
</p>

<Link to="/addskill">
<button>➕ Add Skill</button>
</Link>

<br/><br/>

<Link to="/skills">
<button>📚 View Skills</button>
</Link>

<br/><br/>

<Link to="/match">
<button>🤝 Find Skill Match</button>
</Link>

<br/><br/>

<Link to="/profile">
<button>👤 Profile</button>
</Link>

</div>

)

}

export default Dashboard