import React from 'react'
import './IdDetails.scss'
import { useNavigate, useLocation } from 'react-router-dom'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import ProfileCard from '../../components/ProfileCard/ProfileCard'

const IdDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dlData = location.state;

  console.log("This is the dlData: ", dlData)

  function handleProceed() {
    navigate('/application');
  }

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className="main-content">
        <div className="profile-container">
          <ProfileCard dlData={dlData} />
          <Button onClick={handleProceed} className="proceed-btn">Proceed</Button>
        </div>
      </div>
      <Footer homeIconVisible={true} />
    </div>
  )
}

export default IdDetails