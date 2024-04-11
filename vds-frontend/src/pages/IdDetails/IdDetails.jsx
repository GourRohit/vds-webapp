import React from 'react'
import './IdDetails.scss'
import { useNavigate } from 'react-router-dom'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import ProfileCard from '../../components/ProfileCard/ProfileCard'

const IdDetails = () => {
  const navigate = useNavigate();

  function handleProceed() {
    navigate('/application');
  }

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className="main-content">
        <div className="profile-container">
          <ProfileCard />
          <Button onClick={handleProceed}>Proceed</Button>
        </div>
      </div>
      <Footer homeIconVisible={true} />
    </div>
  )
}

export default IdDetails