import Navbar from "./Navbar"
import "./Layout.css"

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content fade-in">
        {children}
      </main>
    </div>
  )
}

export default Layout
