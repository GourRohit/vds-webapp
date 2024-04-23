import React, { useEffect, useState } from 'react'
import './LegalStatus.scss'
import Form from 'react-bootstrap/Form'

import Button from '../../Button/Button'
import Question from '../Question/Question';

const LegalStatus = ({ step, setStep, setApplicationData }) => {
  const [subSteps, SetSubSteps] = useState(1)
  const [answers, setAnswers] = useState({
    isUSCitizen: ''
  });

  const [registerVoteFormData, setRegisterVoteFormData] = useState({
    optOut: "",
    affirmation: "",
    race: "",
  });

  useEffect(() => {
    const storedLegalStatusAnswers = sessionStorage.getItem('LegalStatusAnswers');
    if (storedLegalStatusAnswers) {
      setAnswers(JSON.parse(storedLegalStatusAnswers))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('LegalStatusAnswers', JSON.stringify(answers))
    console.log("These are the answers: ", answers)
    console.log("These are the registerVoteFormData: ", registerVoteFormData)
  }, [answers, registerVoteFormData])

  // Handle form inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setRegisterVoteFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle Next button
  function handleNext(e) {
    const form = e.currentTarget;
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setApplicationData((prevState) => ({
      ...prevState,
      USCitizen: answers.isUSCitizen === 'Yes' && true,
    }))

    if (answers.isUSCitizen === "Yes") {
      // Move for next Sub Step
      SetSubSteps((step) => step + 1)

    } else {
      setStep((step) => step + 1)
      console.log("This is the steps object: ", step)
    }
  }

  function handleRegisterVoteSubmit(e) {
    // Preventing the default form submitting event
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Setting the form data in the ApplicationData State
    setApplicationData((prevState) => ({
      ...prevState,
      voterRegistrationOptOut: registerVoteFormData.optOut,
      RegisterToVote: registerVoteFormData.affirmation,
      Race: registerVoteFormData.race
    }))

    setStep((step) => step + 1)
    console.log("This is the steps object: ", step)
  }

  return (
    <>
      {subSteps === 1 &&
        <div className='legal-status-wrap'>
          <h2>Legal Status</h2>
          <div className='questions-wrap'>
            <form onSubmit={(e) => handleNext(e)}>
              <div className="questions-wrap-1">
                <Question
                  isRequired={true}
                  answers={answers}
                  setAnswers={setAnswers}
                  questionIndex={0}
                  questionTitle=""
                  questionText="Are you a United States Citizen?"
                />
              </div>

              <Button
                type='submit'
                disabled={(answers.isUSCitizen === "") && true}>
                Next
              </Button>
            </form>
          </div>
        </div>
      }

      {
        subSteps === 2 &&
        <div className="register-vote-wrap">
          <h2 className='form-title'>Register To Vote</h2>
          <Form onSubmit={(e) => handleRegisterVoteSubmit(e)}>
            <div className='register-vote-content-wrap'>
              <div className='register-wrap'>
                <p>The location where the registration application was submitted and any failure to register will remain confidential and will be used for vote registration purposed only.</p>

                <div className='opt-and-note-wrap'>
                  <div className='opt-out-wrap'>
                    {/* <Form.Group> */}
                    {/* <Form.Check
                        required
                        name='optOut'
                        type='checkbox'
                        id='opt-out'
                        label=''
                        className='affirm-checkbox'
                        onChange={handleChange}
                        checked={registerVoteFormData.optOut}
                      /> */}
                    <label>
                      <input
                        required
                        name='optOut'
                        type='checkbox'
                        id='opt-out'
                        className='affirm-checkbox'
                        onChange={(e) => handleChange(e)}
                        checked={registerVoteFormData.optOut}
                      />

                      <span className={`opt-out-btn ${registerVoteFormData.optOut === true ? 'primary' : 'secondary'}`}>Opt-Out</span>
                    </label>
                    {/* </Form.Group> */}
                  </div>

                  <div className='note-wrap'>
                    <p><strong>Note</strong></p>
                    <p>All information provided on this form will be used for voter registration purposes unless you opt-out.</p>
                  </div>
                </div>

                <div className='warning-wrap'>
                  <p><strong>Warning: </strong></p>
                  <p>Any person who registers to vote knowing that such person does not possess the qualifications required by law, who registers under any name other than such person’s own legal name, or who knowingly gives false information in registering, shall be guilty of a felony. The penalties for false registration are up to ten years in prison and up to $100,000.00 fine pursuant to O.C.G.A. 21-2-561 </p>
                </div>

                <Form.Group>
                  <Form.Check
                    required
                    name='affirmation'
                    type='checkbox'
                    id='affirmation'
                    label='Click here to affirm'
                    className='affirm-checkbox'
                    checked={registerVoteFormData.affirmation}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
              </div>

              <div className='race-wrap'>
                <Form.Group className='form-element'>
                  <Form.Label className='label'>Race</Form.Label>
                  <Form.Select
                    name='race'
                    onChange={(e) => handleChange(e)}
                    value={registerVoteFormData.race}
                    className='form-input form-select-input'>

                    <option className='form-input-option' value="">Select an option</option>

                    <option className='form-input-option' value="I do not wish to reveal">I do not wish to reveal </option>
                    <option className='form-input-option' value="Asian / Pacific Islander">Asian / Pacific Islander</option>
                    <option className='form-input-option' value="Black">Black</option>

                    <option className='form-input-option' value="Hispanic / Latino">Hispanic / Latino</option>
                    <option className='form-input-option' value="Multi-Racial">Multi-Racial</option>
                    <option className='form-input-option' value="White">White</option>

                    <option className='form-input-option' value="Other">Other</option>

                  </Form.Select>
                </Form.Group>

                <div className='affirm-text-wrap'>
                  <p><strong>Do you Affirm?</strong></p>
                  <ul>
                    <li>I am a citizen of the United States.</li>
                    <li>I am at least 171/2 years of age.</li>
                    <li>I reside at the address listed on this form.</li>
                    <li>I am eligible to vote in Georgia.</li>
                    <li>I am not serving a sentence for conviction of a felony involving moral turpitude. (You are serving a sentence if you are on probation or parole from your conviction of a felony involving moral turpitude.)</li>
                    <li>I have not been judicially declared mentally incompetent, or if such declaration has been made, the disability has been removed.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type='submit'
              disabled={(
                registerVoteFormData.optOut === "" ||
                registerVoteFormData.affirmation === "" ||
                registerVoteFormData.race === "") && true}>
              Next
            </Button>
          </Form>
        </div>
      }
    </>
  )
}

export default LegalStatus