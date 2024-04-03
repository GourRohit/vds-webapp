import React from "react";
import './Footer.scss'

const Footer = (props) => {
  return (
    <div className="footer">
      <div className="home-btn-wrap">
        <img src={require("../../assets/images/Home-icon.png")} alt="Home page icon" width={50} />
      </div>
      <div className="back-btn-wrap">
        <img src={require("../../assets/images/GoBack-icon.png")} alt="Back icon" width={50} />
      </div>
    </div>
  )
}

export default Footer;