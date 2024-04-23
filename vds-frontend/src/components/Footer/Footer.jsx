import React from "react";
import './Footer.scss'
import { useNavigate } from "react-router-dom";
import { stopInfo } from "../../services/Utils";

const Footer = ({ homeIconVisible, backIconVisible, step, setStep }) => {

  const navigate = useNavigate();

  function cancelReadID() {
    stopInfo()
      .then(() => {
        console.log("Stop Identity Info successful: ")
        sessionStorage.clear()
        navigate('/')
      })
      .catch((error) => {
        console.log("Error while calling the Stop Identity info: ", error)
        sessionStorage.clear()
        navigate('/')
      })
  }

  function handlePrevStep() {
    setStep((prevStep) => {
      if (prevStep > 1) {
        return prevStep - 1;
      }

      return 1;
    })
  }

  return (
    <div className="footer">
      <div className="home-btn-wrap">
        <img
          src={require("../../assets/images/Home-icon.png")}
          alt="Home page icon"
          style={{ display: homeIconVisible ? 'block' : 'none' }}
          onClick={cancelReadID}
        />
      </div>

      <div className="back-btn-wrap">
        <img
          src={require("../../assets/images/GoBack-icon.png")}
          alt="Back icon"
          style={{ display: backIconVisible ? 'block' : 'none' }}
          onClick={handlePrevStep}
        />
      </div>
    </div>
  )
}

export default Footer;