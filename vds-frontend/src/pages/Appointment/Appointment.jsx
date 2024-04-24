import React from 'react'
import './Appointment.scss'
import { useNavigate, useLocation } from 'react-router-dom'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'

const Appointment = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const respData = location.state;

  // TODO: Remove this after debugging
  console.log("Resp data: ", respData)

  function handleFinish() {
    sessionStorage.clear();
    navigate('/');
  }

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className='main-content'>
        <div className="appointment-details">
          <div className="appointment-details-wrap">
            <h1 className="title">Appointment Details</h1>

            {/* TODO: Make it dynamic when backend starts working */}
            <p>ConfirmationID: <strong>{respData && `${respData.confirmationID}`}</strong></p>
            <p>WebServiceID: <strong>{respData && `${respData.webServiceID}`}</strong></p>

          </div>

          <div className="appointment-img-wrap">
            <img
              src={require("../../assets/images/img-placeholder.png")}
              alt="appointment-img"
              className='placeholder-img' />
          </div>
        </div>

        <Button onClick={handleFinish} className="finish-btn">Finish</Button>
      </div>
      <Footer
        homeIconVisible={true}
      />
    </div>
  )
}

export default Appointment