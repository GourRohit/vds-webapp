import React, { useEffect, useState } from 'react'
import './PersonalInfo.scss'
import Button from '../../Button/Button'

import Form from 'react-bootstrap/Form'
import Question from '../Question/Question';

const PersonalInfo = ({ step, setStep, applicationData, setApplicationData }) => {

  const [subSteps, SetSubSteps] = useState(1)
  const [answers, setAnswers] = useState({
    isNameChanged: '',
    isAddressChanged: '',
    isDemographicInfoChanged: '',
    isContactInfoChanged: ''
  })

  const [nameChangeFormData, setNameChangeFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Suffix: ""
  });

  // Load answers from session storage on component mount
  useEffect(() => {
    const storedPersonalInfoAnswers = sessionStorage.getItem('PersonalInfoAnswers');
    const storedNameChangeFormData = sessionStorage.getItem('NameChangeFormData');

    if (storedPersonalInfoAnswers) {
      setAnswers(JSON.parse(storedPersonalInfoAnswers));
    }

    if (storedNameChangeFormData) {
      setNameChangeFormData(JSON.parse(storedNameChangeFormData))
    }
  }, []);


  useEffect(() => {
    // Update session storage whenever answers change
    sessionStorage.setItem('PersonalInfoAnswers', JSON.stringify(answers));
    sessionStorage.setItem('NameChangeFormData', JSON.stringify(nameChangeFormData));

    console.log("These are the answers: ", answers)
  }, [answers, nameChangeFormData])



  function handleNext(e) {
    const form = e.currentTarget;
    console.log(form)
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Updating the application state object
    setApplicationData((prevState) => ({
      ...prevState,
      NameChange: answers.isNameChanged === 'Yes' && true,
      AddressChange: answers.isAddressChanged === 'Yes' && true,
      DemographicUpdate: answers.isDemographicInfoChanged === 'Yes' && true,
      ContactUpdate: answers.isContactInfoChanged === 'Yes' && true
    }))

    if (answers['isNameChanged'] === 'Yes') {
      // Move for next Sub Step
      SetSubSteps((step) => step + 1)

    } else {
      // Move to the NEXT Step
      setStep((prevStep) => prevStep + 1)
    }

    console.log("This is the steps object: ", subSteps)
  }

  // Function to handle the input fields in the Form
  function handleNameChange(event) {
    const { name, value } = event.target
    console.log(`Handling the ${name}: ${value}`)
    setNameChangeFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }


  function handlePersonalInfoSubmit(e) {
    // Preventing the default form submitting event
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log(nameChangeFormData)

    // Setting the form data in the ApplicationData State
    setApplicationData((prevState) => ({
      ...prevState,
      FirstName: nameChangeFormData.FirstName,
      MiddleName: nameChangeFormData.MiddleName,
      LastName: nameChangeFormData.LastName,
      Suffix: nameChangeFormData.Suffix,
      AcknowledgementName: `${nameChangeFormData.FirstName} ${nameChangeFormData.MiddleName} ${nameChangeFormData.LastName}`
    }))

    // Going on to the NEXT Step
    setStep((prevStep) => prevStep + 1)
  }

  return (
    <>
      {subSteps === 1 &&
        <div className='personal-info-wrap'>
          <h2>Personal Information</h2>
          <div className='questions-wrap'>
            <form onSubmit={(e) => handleNext(e)}>
              <div className="questions-wrap-1">
                <Question
                  isRequired={true}
                  answers={answers}
                  questionIndex={0}
                  questionTitle="Name"
                  setAnswers={setAnswers}
                  questionText="Has your name changed?"
                />

                <Question
                  disabled={true}
                  isRequired={true}
                  answers={answers}
                  questionIndex={1}
                  setAnswers={setAnswers}
                  questionTitle="Address"
                  questionText="Do you need to update your address?"
                />
              </div>

              <div className="questions-wrap-2">
                <Question
                  disabled={true}
                  isRequired={true}
                  answers={answers}
                  questionIndex={2}
                  setAnswers={setAnswers}
                  questionTitle="Demographic Information"
                  questionText="Do you need to update your height, weight, or eye color?"
                />

                <Question
                  disabled={true}
                  isRequired={true}
                  answers={answers}
                  questionIndex={3}
                  setAnswers={setAnswers}
                  questionTitle="Contact Information"
                  questionText="Do you need to update your contact information?"
                />
              </div>

              {/* <form action="">
                  <div>
                    <p>Has your name changed?</p>
                    <div>
                      <label htmlFor="name-change">
                        <input type="radio" className='name-change' name='personalInfo' value="Yes" />
                        <span className='form-btn'>Yes</span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="name-change">
                        <input type="radio" className='name-change' name='personalInfo' value="No" />
                        <span className='form-btn'>No</span>
                      </label>
                    </div>
                  </div>
                </form> */
              }

              <Button
                type='submit'
                disabled={(
                  answers.isNameChanged === "" ||
                  answers.isAddressChanged === "" ||
                  answers.isDemographicInfoChanged === "" ||
                  answers.isContactInfoChanged === "") && true}>
                Next
              </Button>
            </form>
          </div>
        </div>
      }

      {
        subSteps === 2 &&
        <div className='name-change-form-wrap'>
          <h2 className='form-title'>Name Change</h2>
          <Form onSubmit={(e) => handlePersonalInfoSubmit(e)} >
            <div className='name-change-form'>
              <Form.Group className='form-element'>
                <Form.Label className='label required'>First Name</Form.Label>
                <Form.Control
                  as="input"
                  type='text'
                  required={true}
                  name='FirstName'
                  placeholder='Sam'
                  className='form-input form-text-input'
                  value={nameChangeFormData.FirstName}
                  onChange={(e) => handleNameChange(e)} />
              </Form.Group>

              <Form.Group className='form-element'>
                <Form.Label className='label'>Middle Name</Form.Label>
                <Form.Control
                  type='text'
                  name='MiddleName'
                  placeholder=''
                  className='form-input form-text-input'
                  value={nameChangeFormData.MiddleName}
                  onChange={(e) => handleNameChange(e)}
                />
              </Form.Group>

              <Form.Group className='form-element'>
                <Form.Label className='label required'>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  required={true}
                  name="LastName"
                  placeholder='Patricks'
                  className='form-input form-text-input'
                  value={nameChangeFormData.LastName}
                  onChange={(e) => handleNameChange(e)} />
              </Form.Group>

              <Form.Group className='form-element'>
                <Form.Label className='label'>Suffix</Form.Label>
                <Form.Select className='form-input form-select-input'>
                  <option className='form-input-option'>Select an option</option>
                </Form.Select>
              </Form.Group>
            </div>

            <Button
              type='submit'
              disabled={(
                nameChangeFormData.FirstName === "" ||
                nameChangeFormData.LastName === "") && true}>
              Next
            </Button>
          </Form>
        </div>
      }



      {/* {answers['isAddressChanged'] &&
        <div className='residential-address-change-form-wrap'>
          <h2 className='form-title'>Residential Address Change</h2>
          <Form className='residential-address-change-form'>
            <Form.Group className='form-element'>
              <Form.Label>Street</Form.Label>
              <Form.Control type='text' placeholder='Hans' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Unit</Form.Label>
              <Form.Control type='text' placeholder='' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>City</Form.Label>
              <Form.Select>
                <option>Select an option</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>State</Form.Label>
              <Form.Control type='text' placeholder='Georgia' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Zipcode</Form.Label>
              <Form.Control type='text' placeholder='Georgia' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Georgia Country</Form.Label>
              <Form.Select>
                <option>Select an option</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Do you have a different mailing address?*</Form.Label>
              <Form.Select>
                <option>Select an option</option>
              </Form.Select>
            </Form.Group>
          </Form>
          <Button>Next</Button>
        </div>
      }

      <div className='mailing-address-change-form-wrap'>
        <h2 className='form-title'>Mailing Address Change</h2>
        <Form className='mailing-address-change-form'>
          <Form.Group className='form-element'>
            <Form.Label>Street</Form.Label>
            <Form.Control type='text' placeholder='Hans' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Unit</Form.Label>
            <Form.Control type='text' placeholder='' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>City</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>State</Form.Label>
            <Form.Control type='text' placeholder='Georgia' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Zipcode</Form.Label>
            <Form.Control type='text' placeholder='Georgia' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Georgia Country</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Do you have a different mailing address?*</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>
        </Form>
        <Button>Next</Button>
      </div>

      <div className='demographic-info-address-change-form-wrap'>
        <h2 className='form-title'>Demographic Information Change</h2>
        <Form className='mailing-address-change-form'>
          <Form.Group className='form-element'>
            <Form.Label>What is your eye color?</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>What is your height?*</Form.Label>
            <Form.Control type='text' placeholder='Feet (ft)' />
            <Form.Control type='text' placeholder='Inch' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>City</Form.Label>
            <Form.Range value={130} />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>State</Form.Label>
            <Form.Control type='text' placeholder='Georgia' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Zipcode</Form.Label>
            <Form.Control type='text' placeholder='Georgia' />
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Georgia Country</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='form-element'>
            <Form.Label>Do you have a different mailing address?*</Form.Label>
            <Form.Select>
              <option>Select an option</option>
            </Form.Select>
          </Form.Group>
        </Form>
        <Button>Next</Button>
      </div> */}

    </>
  )
}

export default PersonalInfo