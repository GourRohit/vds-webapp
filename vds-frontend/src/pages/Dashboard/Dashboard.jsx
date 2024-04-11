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

  const readerInfo = async () => {
    return getReaderinfo()
      .then((response) => {
        if (response.data && response.status) {
          localStorage.setItem("deviceMode", response.data.usbMode);
          localStorage.setItem("readerProfile", response.data.readerProfile.toLowerCase())
          setState((prevState) => {
            return {
              ...prevState,
              deviceMode: response.data.usbMode,
              isLoading: false,
            }
          });
        }
      })
      .catch((error) => {
        setState((prevState) => {
          return {
            ...prevState,
            isLoading: false,
          }
        });
      });
  };

  useEffect(() => {
    let localIdInfo = localStorage.getItem("identityInfoAPIInvoked");
    if (localIdInfo === "true") {
      stopInfo()
        .then(() => {
          localStorage.setItem("identityInfoAPIInvoked", false);
          this.readerInfo();
        })
        .catch((error) => {
          localStorage.setItem("identityInfoAPIInvoked", false);
          console.error(error);
        });

    } else if (state.deviceStatus !== "") {
      readerInfo();
    }
  }, [])

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

        <div className='deviceStatus-msg-container'>
          {
            state.deviceStatus === "NOT_CONNECTED" ? (
              <span className="error-msg">
                Please connect the device and try again
              </span>
            ) : state.deviceStatus === "CONNECTED_AOA_MODE" &&
              state.deviceMode === "HOLDER_DRIVEN" &&
              state.message === "" ? (
              "Tap or scan your mobile DL or physical DL to check in"
            ) : (state.deviceMode === "STANDALONE" ||
              state.deviceMode === "VELOCIRAPTOR") &&
              state.deviceStatus === "CONNECTED_AOA_MODE" ? (
              "Please change the device operation mode to activate reading"
            ) : (
              ""
            )
          }

          {state.deviceStatus === "VDS_NOT_RUNNING" && (
            <span className="error-msg">VDS is not running</span>
          )}

          {state.deviceStatus === "CONNECTED_USB_DEBUG_ENABLED" && (
            <span className="error-msg">Tap2iD is in ADB mode</span>
          )}

          {state.deviceStatus === "CONNECTED_USB_DEBUG_DISABLED" && (
            <span className="error-msg">Tap2iD is not in AOA mode</span>
          )}
        </div>

      </div>

      <Footer homeIconVisible={true} />
    </div>
  )
}

export default Dashboard;