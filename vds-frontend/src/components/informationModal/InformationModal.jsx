import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getIdentityInfo, saveIdData, stopInfo } from "../../services/Utils";
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
    let responseMessage;
    data.indentityInfo = true;
    getIdentityInfo()
      .then((response) => {
        if (response.data.docType === "IDENTITY") {
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
                  setPortrait(res.data.portrait);
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
      // window.addEventListener('popstate', handleBackButton);
      // return () => {
      //   console.log("unmount");
      //   window.removeEventListener('popstate', handleBackButton);
      // }
  }, []);

  // const handleBackButton = () => {
  //   stopInfo();
  // };
  function navigateToCheckinMessage() {
    setCheckinCompleted(true);
  }
  return (
    <div className="information-modal">
      <Header indentityInfo={data.indentityInfo} />
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
              <h3 className="information-modal-nfc-verification-text">NFC</h3>
            </div>
            <div className="message-wrap">
              <p className="message-btn-wrap">
                <Loader />
                <Link to="/" onClick={data.indentityInfo ? stopInfo : null}>
                <Button variant="danger" className="close-btn">Cancel Transaction</Button>
                </Link>
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
              <p className="message-btn-wrap">
                <span className="text-span">Please scan 2D barcode at the back of your DL</span>
                <Link to="/" onClick={data.indentityInfo ? stopInfo : null}>
                <Button variant="danger" className="close-btn">Cancel Transaction</Button>
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default InformationModal;
