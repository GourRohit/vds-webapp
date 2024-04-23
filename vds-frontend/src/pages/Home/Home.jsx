import React, { useState, useEffect } from 'react'
import './Home.scss'

import TopHeader from '../../components/Header/TopHeader';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import TermsAndConditionModal from '../../components/Modal/TermsAndConditionModal';
import { getReaderinfo, stopInfo } from "../../services/Utils"

const HomePage = (props) => {

  const [state, setState] = useState({
    isMDL: false,
    isLoading: false,
    deviceMode: "",
    message: "",
    deviceStatus: props.deviceStatus,
  })

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
          readerInfo();
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
    <>
      <div className="content-wrapper">
        <TopHeader />

        <div className='main-content'>
          <div>
            <h2>Welcome To Georgia Department Of Driver Services</h2>
            <h1 className="title">Do you have a Georgia Driver’s <br /> License?</h1>
            <div className='btns-ctn'>
              <Button
                onClick={handleLicenseToTrue}
                className={`primary ${state.deviceStatus !== "CONNECTED_AOA_MODE" && "disabled"}`}> Yes
              </Button>

              <Button
                onClick={handleLicenseToFalse}
                className={`secondary ${state.deviceStatus !== "CONNECTED_AOA_MODE" && "disabled"}`}> No
              </Button>
            </div>
          </div>

          <div className='deviceStatus-msg-container'>
            {
              state.deviceStatus === "NOT_CONNECTED" ? (
                <span className="error-msg">
                  (Please connect the device and try again)
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
              <span className="error-msg">(VDS is not running)</span>
            )}

            {state.deviceStatus === "CONNECTED_USB_DEBUG_ENABLED" && (
              <span className="error-msg">(Tap2iD is in ADB mode)</span>
            )}

            {state.deviceStatus === "CONNECTED_USB_DEBUG_DISABLED" && (
              <span className="error-msg">(Tap2iD is not in AOA mode)</span>
            )}
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

        <Footer homeIconVisible={false} />
      </div>
    </>
  )
}

export default HomePage;