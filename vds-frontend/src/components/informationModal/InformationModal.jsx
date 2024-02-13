import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getIdentityInfo, saveIdData } from "../../services/Utils";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import Loader from "./Loader";
import Header from "../../containers/header/Header";
import { Navigate } from "react-router";
import { Button } from "react-bootstrap";

const InformationModal = () => {
  const [message, setMessage] = useState("");
  const [portrait, setPortrait] = useState("");
  const [checkinCompleted, setCheckinCompleted] = useState(false);
  const location = useLocation();
  const data = location.state;
  let props = { message, portrait };

  useEffect(() => {
    localStorage.setItem("identityInfoAPIInvoked", true);
    let responseMessage;
    getIdentityInfo()
      .then((response) => {
        if (response.data.docType === "IDENTITY") {
          if (response.data.data.documentNumber === "") {
            if (response.data.data.isAgeOver21 === true) {
              responseMessage =
                "Your age has been verified and it is above 21 years";
            } else if (response.data.data.isAgeOver18 === true) {
              responseMessage =
                "Your age has been verified and it is above 18 years";
            } else {
              responseMessage = "Your age verification has failed and its below 21 years";
            }
            setMessage(responseMessage);
            setPortrait(response.data.data.portrait);
            navigateToCheckinMessage();
          } else {
            saveIdData(response.data.data)
              .then((res) => {
                if (res.data && res.status) {
                  if (res.data.message === "success") {
                    responseMessage = ` Welcome ${response.data.data.givenNames} ${response.data.data.familyName}, you are checked in for 
                    your ${res.data.appointmentTime} appointment.`;
                    setMessage(responseMessage);
                    setPortrait(response.data.data.portrait);
                  } else if (res.data.message === "duplicate") {
                    responseMessage = ` Welcome ${response.data.data.givenNames} ${response.data.data.familyName}, we
                  could find that you are already checked in for appointment at ${res.data.appointmentTime}`;
                    setMessage(responseMessage);
                    setPortrait(response.data.data.portrait);
                  } else {
                    setMessage(message);
                  }
                }
              })
              .then(() => {
                navigateToCheckinMessage();
              })
              .catch((error) => {
                responseMessage = "Your check-in could not be completed";
                setMessage(responseMessage);
                navigateToCheckinMessage();
              });
          }
        } else if (response.data.docType === "QR_CODE") {
          setMessage(response.data.data.qrCodeData);
          navigateToCheckinMessage();
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        responseMessage = "Your check-in could not be completed";
        setMessage(responseMessage);
        navigateToCheckinMessage();
      });
  }, []);

  function navigateToCheckinMessage() {
    setCheckinCompleted(true);
  }
  return (
    <div className="information-modal">
      <Header />
      {data.isMdL ? (
        <span className="information-modal-text-span">
          Follow instructions to complete ID verification
        </span>
      ) : (
        <span className="information-modal-text-span">
          Check In with Physical DL
        </span>
      )}
      <div className="modal-wrap">
        {checkinCompleted ? <Navigate to="message" state={props} /> : null}
        {data.isMdL ? (
          <>
            <div className="information-container">
              <div className="information-section">
                <div className="information-modal-image-wrap">
                  <img
                    className="information-modal-image"
                    src={QRGIF1}
                    alt="qr-gif"
                  ></img>
                  <img
                    className="information-modal-image"
                    src={QRGIF2}
                    alt="nfc-gif"
                  ></img>
                </div>
                <div className="information-modal-name-wrap">
                  <h3 className="information-modal-qr-verification-text">
                    QR Code
                  </h3>
                  <h3 className="information-modal-nfc-verification-text">
                    NFC
                  </h3>
                </div>
              </div>
              <div className="information-btn-wrap">
                <div className="close-btn-div">
                  <Link to="/">
                    <Button variant="danger" className="close-btn">
                      Cancel Transaction
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="message-wrap">
              <p className="message-btn-wrap">
                <Loader />
              </p>
              <p className="message-btn-wrap">
                <span className="message-span">
                  Once mDL is presented, please stay on this screen till Verification completes
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="information-container">
              <div className="information-section">
                <div className="information-modal-image-wrap">
                  <img
                    className="information-modal-image-physical"
                    src={physicalIMG}
                    alt="physicalImg"
                  ></img>
                </div>
              </div>
              <div className="close-btn-div-physical">
                <Link to="/">
                  <Button variant="danger" className="close-btn">
                    Cancel Transaction
                  </Button>
                </Link>
              </div>
            </div>
            <div className="message-wrap">
              <p className="message-btn-wrap">
                <span className="text-span">
                  Please scan 2D barcode at the back of your DL
                </span>
              </p>
              <p className="message-btn-wrap">
                <span className="message-span">
                  Once Physical ID is presented, please stay on this screen till Verification completes
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default InformationModal;
