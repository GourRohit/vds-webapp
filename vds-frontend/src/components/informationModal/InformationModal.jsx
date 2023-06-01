import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import moment from "moment";
import { API_URL } from "../../UrlConfig";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import { Button } from "react-bootstrap";
import Loader from "./Loader";

const InformationModal = (props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      .post(`${API_URL}/data`, idData)
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
        setIsLoading(false)
        message = "Failed to checkin. Error received"
        setMessage(message);
      });
  }

  function getIdentityInfo() {
    let message = "";
    axios
      .get("http://localhost:8081/verifier-sdk/identity/info")
      .then((response) => {
        if (response.data) {
          setIsLoading(false);
          saveIdData(response.data.data);
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        setIsLoading(false)
        message = "Failed to checkin. Error received"
        setMessage(message)
      });
  }
  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.modalclose}
      aria-labelledby="example-modal-sizes-title-lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {props.isMobileDLCheck
            ? "Follow instructions to complete ID verification"
            : "Check In with Physical DL"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-wrap">
          {props.isMobileDLCheck ? (
            <>
              <div className="image-wrap">
                <img src={QRGIF1} alt="qr-gif"></img>
                <img src={QRGIF2} alt="nfc-gif"></img>
              </div>
              <div className="name-wrap">
                <h3 className="qr-verification-text">QR Verification</h3>
                <h3 className="nfc-verification-text">NFC Verification</h3>
              </div>
              <div className="message-wrap">
                <p>{isLoading ? <Loader /> : message}</p>
              </div>
              <div className="done-btn">
                <Button
                  size="lg"
                  variant={!isLoading ? "primary" : "secondary"}
                  disabled={isLoading}
                  onClick={() => props.modalclose(false)}
                >
                  Done
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="modal-wrap">
                <div className="image-wrap">
                  <img
                    className="plImg"
                    src={physicalIMG}
                    alt="physicalImg"
                  ></img>
                </div>
                <div className="physical-verification">
                  <h3>Physical Verification</h3>
                </div>
                <div className="message-wrap">
                  <p>{isLoading ? <Loader /> : message}</p>
                </div>
                <div className="done-btn">
                  <Button
                    size="lg"
                    variant={!isLoading ? "primary" : "secondary"}
                    disabled={isLoading}
                    onClick={() => props.modalclose(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InformationModal;
