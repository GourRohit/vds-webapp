import React from 'react'
import './Appointment.scss'
import { useNavigate } from 'react-router-dom'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'

const Appointment = () => {
  const navigate = useNavigate();

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

            {/* TODO: Make the counter and wait time dynamic */}
            <p>Proceed to counter: <strong> 07 </strong> </p>
            <p>Estimated wait time : 20minutes</p>

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