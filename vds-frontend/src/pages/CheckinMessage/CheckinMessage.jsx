import React from 'react'
import './CheckinMessage.scss'

import CheckinSucces from '../../components/Others/CheckinSuccess/CheckinSucces'
import CheckinError from '../../components/Others/CheckinError/CheckinError'
import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import { useLocation, useNavigate } from 'react-router-dom'

const CheckinMessage = () => {
  const location = useLocation();
  const dlData = location.state;

  console.log("This is the data: ", dlData);

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className="main-content">
        {dlData.message === "success" ? <CheckinSucces userDLData={dlData.data} /> : <CheckinError error={dlData.data} />}
      </div>
      <Footer homeIconVisible={true} />
    </div>
  )
}

export default CheckinMessage