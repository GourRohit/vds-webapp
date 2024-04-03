import React from "react";
import './TermsAndConditionModal.scss'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaTimes } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";

const TermsAndConditionModal = ({ showModal, isLicenseAvailable, handleShowModal, handleCloseModal }) => {
  const navigate = useNavigate();

  const handleProceed = () => {
    console.log("Let's Proceed for verification!")
    navigate("/dashboard")
  }

  return (
    <div>
      <Modal
        centered
        size="lg"
        keyboard={false}
        backdrop="static"

        show={showModal}
        onHide={handleCloseModal}
      >
        <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
          <div className="modal-close" onClick={handleCloseModal} style={{ position: 'absolute', top: '-42px', right: '-5px', cursor: 'pointer', fontSize: '20px', zIndex: '1100', width: '36px', height: '36px', backgroundColor: '#315999', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FaTimes />
          </div>
        </IconContext.Provider>

        <Modal.Header>
          <Modal.Title>Terms and condition</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflow: 'scroll' }}>
          Terms & Conditions

          Welcome to www.lorem-ipsum.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.
          1. YOUR AGREEMENT
          By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.
          PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
          2. PRIVACY
          Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
          3. LINKED SITES
          This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials

          Terms & Conditions

          Welcome to www.lorem-ipsum.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.
          1. YOUR AGREEMENT
          By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.
          PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
          2. PRIVACY
          Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
          3. LINKED SITES
          This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials

        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleProceed}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TermsAndConditionModal;