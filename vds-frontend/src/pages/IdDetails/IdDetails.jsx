import React from 'react'
import './IdDetails.scss'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import ProfileCard from '../../components/ProfileCard/ProfileCard'

const IdDetails = () => {
  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className="main-content">
        <div className="profile-container">
          <ProfileCard />
          <Button>Proceed</Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default IdDetails