import React, { useEffect } from "react"

import { images } from "../../constants/constants"
import logo from "../../assets/images/motokobootcamp.png"
import { useAuthStore } from "../../store/authstore"
import "./_header.scss"
import { Principal } from "@dfinity/candid/lib/cjs/idl"
import { useUserStore } from "../../store/userStore"

const Header: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <header>
      <div className="header-content">
        <a href="/">
          <img src={logo} alt="Motoko Bootcamp" className="logo" />
        </a>
      </div>
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
    </header>
  )
}

export default Header
