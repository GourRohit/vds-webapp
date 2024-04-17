import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import { useNavigate } from "react-router-dom";

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import DashboardButton from '../../components/DashboardButton/DashboardButton'
import { getReaderinfo, stopInfo } from "../../services/Utils"


const Dashboard = (props) => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    isMDL: false,
    isLoading: false,
    deviceMode: "",
    message: "",
    deviceStatus: props.deviceStatus,
  })


  function handleMDLScan(isMDLScan) {
    console.log("Handling the mDL scan");
    setState((prevState) => {
      return {
        ...prevState,
        isMDL: isMDLScan
      }
    })

    navigate("/checkin", { state: { isMDL: isMDLScan } });
  }


  return (
    <div className="content-wrapper">
      <TopHeader />

      <div className="main-content">
        <h1 className="title">Check-in with your Driver’s License(DL)</h1>

        <div className='db-btn-container'>
          <DashboardButton onClick={() => handleMDLScan(false)}>
            <img src={require("../../assets/images/physicalDL.png")} alt="physicalDL" />
            <span className='db-btn-text'>With <br /> physical DL</span>
          </DashboardButton>

          <DashboardButton onClick={() => handleMDLScan(true)}>
            <img src={require("../../assets/images/mDL.png")} alt="mobileDL" />
            <span className='db-btn-text'>With <br /> Mobile DL</span>
          </DashboardButton>
        </div>
      </div>

      <Footer homeIconVisible={true} />
    </div>
  )
}

export default Dashboard;