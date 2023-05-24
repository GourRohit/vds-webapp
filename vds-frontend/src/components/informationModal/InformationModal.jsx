import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import moment from "moment";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";

const InformationModal = (props) => {
  const [message, setMessage] = useState("");
  const [docNumber, setDocNumber] = useState("");

  useEffect(() => {
    getIdentityInfo();
  });

  function saveIdData() {
    const idData = {
      documentNumber: docNumber,
    };
    axios
      .post(
        "http://ec2-15-206-123-117.ap-south-1.compute.amazonaws.com:3000/data",
        idData
      )
      .then((res) => {
        if (res.data && res.status) {
          return res.status;
        }
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
  function getIdentityInfo() {
    axios
      .get("http://localhost:8081/verifier-sdk/identity/info")
      .then((response) => {
        if (response.data) {
          console.log("Response received from identity info API");
          var time = moment().add(30, "m").format("LT");
          //setCurrentTime = time;
          setDocNumber(response.data.data.documentNumber);
          let responseStatus = saveIdData();
          if (responseStatus === 200) {
            console.log("200");
            setMessage(` Welcome Mr. ${response.data.data.givenNames} ${response.data.data.familyName}, you are checked in for 
            your ${time} appointment.`);
          } else if (responseStatus === 409) {
            console.log("409");
            setMessage(` Welcome Mr. ${response.data.data.givenNames} ${response.data.data.familyName}, we
              could find an appointment for you, you are checked in to the
              walk-in line ${time}.`);
          } else {
            console.log("No response from db");
            setMessage("");
          }
        } else {
          console.log("noData");
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
                <img src={QRGIF1}></img>
                <img src={QRGIF2}></img>
              </div>
              <div className="message-wrap">
                <p>{message}</p>
              </div>
            </>
          ) : (
            <>
              <div className="modal-wrap">
                <div className="image-wrap">
                  <img className="plImg" src={physicalIMG}></img>
                </div>
                <div className="message-wrap">
                  <p>{message}</p>
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
