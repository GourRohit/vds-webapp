import React, { useEffect } from 'react'
import './CheckinSuccess.scss'
import { useNavigate } from 'react-router-dom'

const CheckinSucces = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Setting the timeout to wait for 5 seconds
    const timer = setTimeout(() => {

      // Navigating to the '/id' page after 5 seconds
      navigate('/id', { state: props.userDLDate });
    }, 5000);

    // CLean up function to clear the timeout if component unmount before 5 seconds
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="dl-scan-result-container">
      <div className="result-msg">
        <p>ID Verified!</p>
      </div>
      <div className='result-img'>
        <img src={require("../../../assets/images/CheckCircle.png")} alt="Check circle" />
      </div>
    </div>
  )
}

export default CheckinSucces