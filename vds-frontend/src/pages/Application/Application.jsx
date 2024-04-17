import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import './Application.scss'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'

import PersonalInfo from '../../components/Forms/PersonalInfo/PersonalInfo'
import VisionAndMedical from '../../components/Forms/VisionAndMedical/VisionAndMedical'
import LegalStatus from '../../components/Forms/LegalStatus/LegalStatus'
import Donations from '../../components/Forms/Donations/Donations'
import { sendApplication } from '../../services/Utils'
import { useNavigate } from 'react-router-dom'

const Application = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSigned, setIsSigned] = useState(false);

  const [applicationData, setApplicationData] = useState({
    GADLN: "",
    DOB: "",

    FirstName: "",
    MiddleName: "",
    LastName: "",

    curEmail: "",
    USCitizen: false,
    CDLCredential: false,
    NameChange: false,
    DemographicUpdate: false,
    ContactUpdate: false,
    AddressChange: false,
    CorrectiveLenses: false,
    SeizuresFainting: false,
    BloodTypeDisplay: false,
    OrganDonor: false,
    DonationBlindness: false,
    DonationEducation: false,
    Acknowledgement: false,
    AcknowledgementName: "",
  });

  // Timer for the application form
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  function handleCheckboxChange(e) {
    console.log(e.target)
    setIsSigned(!isSigned)

    setApplicationData((prevState) => ({
      ...prevState,
      Acknowledgement: !isSigned
    }))
  }

  // Handling Application data submission to Node.js backend
  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...applicationData }
    console.log("This data will be sent to NodeJS backend: ", data)

    sendApplication(data)
      .then(() => {
        console.log("Application sent successfully!!!")

        // Navigating to the appointment
        navigate('/appointment')
      })
      .catch((error) => {
        console.log("Application failed", error)
      })
  }

  useEffect(() => {
    let timer = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        // Timer has reached 0, clearing the interval
        clearInterval(timer);

        // TODO: Do something when the time is up
        // WIll show a alert message that time is up, either continue or cancel the application
      } else if (seconds === 0) {
        // If seconds reach 0, decrement minutes and set seconds to 59
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        // Decrement seconds
        setSeconds(seconds - 1);
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [minutes, seconds])

  useEffect(() => {
    console.log("ApplicationData is updated: ", applicationData)
  }, [applicationData])

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className='main-content'>

        {step === 1 && <PersonalInfo step={step} setStep={setStep} applicationData={applicationData} setApplicationData={setApplicationData} />}
        {step === 2 && <VisionAndMedical step={step} setStep={setStep} applicationData={applicationData} setApplicationData={setApplicationData} />}
        {step === 3 && <LegalStatus step={step} setStep={setStep} applicationData={applicationData} setApplicationData={setApplicationData} />}
        {step === 4 && <Donations step={step} setStep={setStep} applicationData={applicationData} setApplicationData={setApplicationData} />}

        {step === 5 &&
          <div className='acknowledgement-wrap'>
            <Form>
              <h2 className='form-title'>Acknowledgement</h2>
              <p>Under penalty of law, I swear or affirm that I am a resident of the State of Georgia, and the information provided on this form is true and correct. I understand that it is illegal to make false, fictious, or fraudulent statements on this form. I grant permission to the Department of Driver Services to verify information furnished to the Department through the release of any and all applicant information to third parties which shall include, but not be limited to the U.S. Department of Homeland Security or other public entities wherein such disclosure of the information by the Department is not prohibited by law. </p>
              <p><strong>Name:</strong> {applicationData.AcknowledgementName}</p>

              <Form.Group>
                <Form.Check
                  required
                  type='checkbox'
                  id='acknowledge-confirm'
                  label='By checking this box, I am electronically signing my application.'
                  className='acknowledge-confirm'
                  checked={isSigned}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>

              <Button
                type='submit'
                className={`submit-btn primary ${!isSigned && 'disabled'}`}
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </Button>
            </Form>
          </div>
        }

        <div className='timer-wrap'>
          <p className='timer-text'>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} mins left</p>
        </div>
      </div>

      <Footer
        homeIconVisible={true}
        backIconVisible={true}
        step={step}
        setStep={setStep}
      />
    </div>
  )
}

export default Application