import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import "./_nav.scss"
import { useAuthStore } from "../../store/authstore"
import logo from "../../assets/images/motokobootcamp.png"

const Nav: React.FC = () => {
  //todo hide profile if logged in (currently not worth a bug if it doesn't work)
  const loggedIn = useAuthStore((state) => state.isLoggedin)
  // <header>
  //     <div className="header-content">
  //       <a href="/">
  //         <img src={logo} alt="Motoko Bootcamp" className="logo" />
  //       </a>
  //     </div>

  //   </header>
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <nav>
      <div className="header-content">
        <a href="/">
          <img src={logo} alt="Motoko Bootcamp" className="logo" />
        </a>
      </div>
      <ul>
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/submit" className="nav-link">
            Submit Code
          </Link>
        </li>
        {/* <li>
          <Link to="/schedule" className="nav-link">
            Schedule
          </Link>
        </li> */}
        {/* <li>
          <Link to="/resources" className="nav-link">
            Resources
          </Link>
        </li> */}

        <li>
          <Link to="/Profile" className="nav-link">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>

        <li>
          <div
            className="auth-section"
            style={{
              filter: "drop-shadow(1px 5px 1px black)",
            }}
          >
            {isLoggedIn ? (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            ) : (
              <button className="btn" onClick={login}>
                Login
              </button>
            )}
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
