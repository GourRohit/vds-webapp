import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
const InformationModal = (props) => {
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
                <p>{props.message}</p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InformationModal;
