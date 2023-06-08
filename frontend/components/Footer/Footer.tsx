import React from "react"
import "./_footer.scss"
import { images } from "../../constants/constants"
import logo from "../../assets/images/dfinity.svg"
import hero from "../../assets/images/MBC-background.png"

const Footer: React.FC = () => {
  return (
    <footer>
      {/* <img src={logo} alt="Footer Logo" className="footer-logo" /> */}
      <img src={hero} alt="Footer Logo" className="footer-hero" />
    </footer>
  )
}

export default Footer
