import React, { useState } from 'react'
import './Home.scss'

import TopHeader from '../../components/Header/TopHeader';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import TermsAndConditionModal from '../../components/Modal/TermsAndConditionModal';

const HomePage = () => {

  const [showModal, setShowModal] = useState(false);
  const [isLicenseAvailable, setIsLicenseAvailable] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleLicenseToTrue = () => {
    setIsLicenseAvailable(true)
    setShowModal(true)
  }

  const handleLicenseToFalse = () => {
    setIsLicenseAvailable(false)
    setShowModal(false)
  }

  return (
    <>
      <div className="content-wrapper">
        <TopHeader />

        <div className='main-content'>
          <div>
            <h2>Welcome To Georgia Department Of Driver Services</h2>
            <h1 className="title">Do you have a Georgia Driver’s <br /> License?</h1>
            <div className='btns-ctn'>
              <Button onClick={handleLicenseToTrue} className="primary"> Yes </Button>
              <Button onClick={handleLicenseToFalse} className="secondary"> No </Button>
            </div>
          </div>

          {
            (isLicenseAvailable && showModal) &&
            <TermsAndConditionModal
              showModal={showModal}
              handleShowModal={handleShowModal}
              handleCloseModal={handleCloseModal}
              isLicenseAvailable={isLicenseAvailable}
            />
          }
        </div>

        <Footer />
      </div>
    </>
  )
}

export default HomePage;