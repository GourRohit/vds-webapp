import React, { useEffect } from 'react'
import './CheckinError.scss'
import { useNavigate } from 'react-router-dom'

import Button from '../../Button/Button'

const CheckinError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Setting the timeout to wait for 5 seconds
    const timer = setTimeout(() => {
      // Navigate to the dashboard page after 5 seconds
      navigate('/dashboard');
    }, 5000)

    // CLean up function to clear the timeout if component unmount before 5 seconds
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className="dl-scan-result-container">
      <div className="result-msg">
        <p className='error-msg'>Error Message!</p>
        <Button>Exit</Button>
      </div>
      <div className='result-img'>
        <img src={require("../../../assets/images/Error.png")} alt="Error" />
      </div>
    </div>
  )
}

export default CheckinError