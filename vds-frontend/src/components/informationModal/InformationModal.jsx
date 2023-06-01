import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import { Button } from "react-bootstrap";
import { saveIdData } from "../../utils/SaveIdData";
import Loader from "./Loader";

const InformationModal = (props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIdentityInfo();
  }, []);

  function getIdentityInfo() {
    axios
      .get("http://localhost:8081/verifier-sdk/identity/info")
      .then((response) => {
        if (response.data) {
          console.log("response.data", response.data);
          setIsLoading(false);
          let messageResponse = saveIdData(response.data.data);
          setMessage(messageResponse);
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        console.error(error);
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
