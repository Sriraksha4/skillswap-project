import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AddSkill from "./pages/AddSkill"
import ViewSkills from "./pages/ViewSkills"
import Profile from "./pages/Profile"
import SkillMatch from "./pages/SkillMatch"




function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addskill" element={<AddSkill />} />
        <Route path="/skills" element={<ViewSkills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match" element={<SkillMatch />} />
        

      </Routes>

    </BrowserRouter>

  )

}

export default App