import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { API_URL, VDS_URL } from "../../UrlConfig";
import { getIdentityInfo, saveIdData } from "../../services/Utils";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import Loader from "./Loader";
import Header from "../../containers/header/Header";
import { Navigate } from "react-router";

const InformationModal = () => {
  const [message, setMessage] = useState("");
  const [checkinCompleted, setCheckinCompleted] = useState(false);
  const location = useLocation();
  const data = location.state;
  let time = moment().add(30, "m").format("LT");

  useEffect(() => {
    let responseMessage;
    getIdentityInfo()
      .then((response) => {
        console.log("RES.DATA", response.data);
        if (response.data) {
          saveIdData(response.data.data)
            .then((res) => {
              console.log("RES", res);
              if (res.data && res.status) {
                if (res.data.message === "success") {
                  responseMessage = ` Welcome ${response.data.data.givenNames} ${response.data.data.familyName}, You are checked in for 
                your ${time} appointment.`;
                  setMessage(responseMessage);
                } else if (res.data.message === "duplicate") {
                  responseMessage = ` Welcome ${response.data.data.givenNames} ${response.data.data.familyName}, We
                  could find that you are already checked in for appointment at ${res.data.appointmentTime}`;
                  setMessage(responseMessage);
                } else {
                  setMessage(message);
                }
              }
            })
            .then((responseMessage) => {
              console.log("in .then navigation", responseMessage);
              navigateToCheckinMessage(responseMessage);
            })
            .catch((error) => {
              responseMessage = "Your check-in could not be completed";
              setMessage(responseMessage);
              navigateToCheckinMessage(responseMessage);
            });
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        responseMessage = "Your check-in could not be completed";
        setMessage(responseMessage);
        navigateToCheckinMessage(responseMessage);
      });
  }, []);

  function navigateToCheckinMessage(message) {
    console.log("in navigate checkin message", message);
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
        {checkinCompleted ? <Navigate to="message" state={message} /> : null}
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
