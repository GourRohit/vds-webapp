import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { API_URL, VDS_URL } from "../../UrlConfig";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import Loader from "./Loader";
import Header from "../../containers/header/Header";
import { Navigate } from "react-router";

const InformationModal = () => {
  const [message, setMessage] = useState("");
  const [checkinMessage, setCheckinMessage] = useState(false);
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    getIdentityInfo();
  }, []);

  function saveIdData(data) {
    let message = "";
    let time = moment().add(30, "m").format("LT");
    const idData = {
      documentNumber: data.documentNumber,
      currentTime: time,
    };
    axios
      .post(`${API_URL}data`, idData)
      .then((res) => {
        if (res.data && res.status) {
          if (res.data.message === "success") {
            message = ` Welcome ${data.givenNames} ${data.familyName}, you are checked in for 
              your ${time} appointment.`;
            setMessage(message);
          } else if (res.data.message === "duplicate") {
            message = ` Welcome ${data.givenNames} ${data.familyName}, we
                could find that you are already checked in for appointment at ${res.data.appointmentTime}`;
            setMessage(message);
          }
          setMessage(message);
        }
      })
      .catch((err) => {
        message = "Check-in Failed";
        setMessage(message);
      });
  }

  function getIdentityInfo() {
    let message = "";
    axios
      .get(`${VDS_URL}/identity/info`)
      .then((response) => {
        if (response.data) {
          saveIdData(response.data.data);
          setTimeout(() => {
            navigateToCheckinMessage();
          }, 1000);
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        message = "Check-in Failed";
        setMessage(message);
        navigateToCheckinMessage();
      });
  }
  function navigateToCheckinMessage() {
    setCheckinMessage(true);
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
        {checkinMessage ? <Navigate to="message" state={message} /> : null}
        {data.isMdL ? (
          <>
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
                QR Code Presentation
              </h3>
              <h3 className="information-modal-nfc-verification-text">
                NFC Presentation
              </h3>
            </div>
            <div className="message-wrap">
              <p>
                <Loader />
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="information-modal-image-wrap">
              <img
                className="information-modal-image"
                src={physicalIMG}
                alt="physicalImg"
              ></img>
            </div>
            <div className="message-wrap">
              <p>
                <span>Please scan 2D barcode at the back of your DL</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default InformationModal;
