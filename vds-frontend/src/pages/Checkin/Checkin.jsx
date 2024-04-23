import React, { useEffect, useState } from 'react'
import './Checkin.scss'
import { useLocation, useNavigate } from "react-router-dom";

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import { getIdentityInfo, stopInfo } from '../../services/Utils'

const Checkin = () => {
  const location = useLocation();
  const data = location.state;

  const [userDLData, setUserDLData] = useState({
    message: "",
    data: {}
  });

  const navigate = useNavigate();
  console.log("This is the state data: ", data);

  function handleCancel() {
    stopInfo()
      .then(() => {
        console.log("Stop Identity Info successful: ")
        navigate('/')
      })
      .catch((error) => {
        console.log("Error while calling the Stop Identity info: ", error)
        navigate('/')
      })
  }

  useEffect(() => {
    // TODO Need to call the API for either physical scan or MDL scan
    getIdentityInfo()
      .then((response) => {
        setUserDLData(() => {
          return {
            message: "success",
            data: response.data
          }
        })
        navigate('/checkin/message', { state: { message: "success", data: response.data } })
      })
      .catch((error) => {
        setUserDLData(() => {
          return {
            message: "Error",
            data: error
          }
        })
        navigate('/checkin/message', { state: { message: "error", data: error } });
      })
  }, [])

  return (
    <div className="content-wrapper">
      <TopHeader />
      <div className="main-content">
        <div className='dl-scan-container'>
          {
            !data.isMDL ?
              <div className='dl-scan-msg'>
                <h1 className="title">Physical Driver’s License</h1>
                <p>Scan the barcode present at the back of your valid DL for verification</p>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
              :
              <div className='dl-scan-msg'>
                <h1 className="title">Mobile Driver's License</h1>
                <p>Tap for NFC or Scan the QR code for verification</p>
                <Button onClick={handleCancel}>Cancel</Button>
                <p className='imp-instruction-msg'>Please provide consent after NFC tap or QR code scan</p>
              </div>
          }


          <div className='dl-scan-img-container'>
            {
              !data.isMDL ?
                <img
                  src={require("../../assets/images/physicalDL-scanning.png")}
                  alt="mdl scanning"
                  className='dl-scan-img physicalDL-scan-img' />
                :
                <img
                  src={require("../../assets/images/mDL-scanning.png")}
                  alt="mdl scanning"
                  className='dl-scan-img' />
            }
          </div>
        </div>
      </div>
      <Footer homeIconVisible={true} />
    </div>
  )
}

export default Checkin;