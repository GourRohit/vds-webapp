import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import moment from "moment";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import { Button } from "react-bootstrap";

const InformationModal = (props) => {
  const [message, setMessage] = useState("");
  // const [docNumber, setDocNumber] = useState("");

  useEffect(() => {
    getIdentityInfo();
  }, []);

  function saveIdData(data) {
    var time = moment().add(30, "m").format("LT");
    const idData = {
      documentNumber: data.documentNumber,
    };
    axios
      .post(
        "http://ec2-15-206-123-117.ap-south-1.compute.amazonaws.com:3000/data",
        idData
      )
      .then((res) => {
        console.log("response from saveData", res);
        if (res.data && res.status) {
          if (res.data.message === "success") {
            setMessage(` Welcome ${data.givenNames} ${data.familyName}, you are checked in for 
            your ${time} appointment.`);
          } else if (res.data.message === "duplicate") {
            setMessage(` Welcome ${data.givenNames} ${data.familyName}, we
              could find that you are already checked in.`);
          } else {
            setMessage("");
          }
        }
      })
      .catch((err) => {
        console.error("error response", err);
        return "failed";
      });
  }
  function getIdentityInfo() {
    axios
      .get("http://localhost:8081/verifier-sdk/identity/info")
      .then((response) => {
        if (response.data) {
          //setCurrentTime = time;
          //setDocNumber(response.data.data.documentNumber);
          saveIdData(response.data.data);
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
            ? "Check in with Mobile DL"
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
                <p>{message}</p>
              </div>
              <div className="done-btn">
                <Button
                  size="lg"
                  variant={message ? "primary" : "secondary"}
                  disabled={!message}
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
                  <p>{message}</p>
                </div>
                <div className="done-btn">
                  <Button
                    size="lg"
                    variant={message ? "primary" : "secondary"}
                    disabled={!message}
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
