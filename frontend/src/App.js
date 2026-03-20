import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import { ToastProvider } from "./components/Toast"

import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AddSkill from "./pages/AddSkill"
import ViewSkills from "./pages/ViewSkills"
import Profile from "./pages/Profile"
import SkillMatch from "./pages/SkillMatch"
import Messages from "./pages/Messages"

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/addskill"
            element={
              <Layout>
                <AddSkill />
              </Layout>
            }
          />
          <Route
            path="/skills"
            element={
              <Layout>
                <ViewSkills />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/match"
            element={
              <Layout>
                <SkillMatch />
              </Layout>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <Layout>
                <Messages />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

