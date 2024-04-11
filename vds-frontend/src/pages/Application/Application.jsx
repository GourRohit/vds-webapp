import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import './Application.scss'

import TopHeader from '../../components/Header/TopHeader'
import Footer from '../../components/Footer/Footer'

import PersonalInfo from '../../components/Forms/PersonalInfo/PersonalInfo'
import VisionAndMedical from '../../components/Forms/VisionAndMedical/VisionAndMedical'
import LegalStatus from '../../components/Forms/LegalStatus/LegalStatus'
import Donations from '../../components/Forms/Donations/Donations'
import Button from '../../components/Button/Button'

const Application = () => {

  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState({});

  return (
    <div className='content-wrapper'>
      <TopHeader />
      <div className='main-content'>
        {step === 1 && <PersonalInfo />}
        {step === 2 && <VisionAndMedical />}
        {step === 3 && <LegalStatus />}
        {step === 4 && <Donations />}

        {step === 5 &&
          <div className='acknowledgement-wrap'>
            <Form>
              <h2 className='form-title'>Acknowledgement</h2>
              <p>Under penalty of law, I swear or affirm that I am a resident of the State of Georgia, and the information provided on this form is true and correct. I understand that it is illegal to make false, fictious, or fraudulent statements on this form. I grant permission to the Department of Driver Services to verify information furnished to the Department through the release of any and all applicant information to third parties which shall include, but not be limited to the U.S. Department of Homeland Security or other public entities wherein such disclosure of the information by the Department is not prohibited by law. </p>
              <p><strong>Name:</strong> Sam Patriks</p>

              <Form.Group>
                <Form.Check
                  required
                  type='checkbox'
                  id='acknowledge-confirm'
                  label='By checking this box, I am electronically signing my application.'
                  className='acknowledge-confirm'
                />
              </Form.Group>
              <Button>Submit</Button>
            </Form>
          </div>
        }
      </div>
      <Footer />
    </div>
  )
}

export default Application