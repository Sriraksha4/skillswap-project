import "../styles.css"

function Profile(){

const user = JSON.parse(localStorage.getItem("user"))

return(

<div className="card">

<h1>👤 User Profile</h1>

<p><b>Name:</b> {user?.name}</p>
<p><b>Email:</b> {user?.email}</p>

<p className="quote">
"Learning never exhausts the mind."
</p>

</div>

)

}

export default Profile