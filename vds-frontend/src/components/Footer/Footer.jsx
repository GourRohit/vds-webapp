import React from "react";
import './Footer.scss'
import { useNavigate } from "react-router-dom";
import { stopInfo } from "../../services/Utils";

const Footer = ({ homeIconVisible, backIconVisible }) => {

  const navigate = useNavigate();

  function cancelReadID() {
    stopInfo()
      .then(() => {
        console.log("Stop Identity Info successful: ")
        navigate('/')
      })
      .catch((error) => {
        console.log("Error while calling the Stop Identity info: ", error)
        navigate('/')
      })
  }

  return (
    <div className="footer">
      <div className="home-btn-wrap">
        <img
          src={require("../../assets/images/Home-icon.png")}
          alt="Home page icon"
          width={50}
          style={{ display: homeIconVisible ? 'block' : 'none' }}
          onClick={cancelReadID}
        />
      </div>

      <div className="back-btn-wrap">
        <img
          src={require("../../assets/images/GoBack-icon.png")}
          alt="Back icon"
          width={50}
          style={{ display: backIconVisible ? 'block' : 'none' }}
        />
      </div>
    </div>
  )
}

export default Footer;