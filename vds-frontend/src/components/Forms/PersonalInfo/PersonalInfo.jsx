import React, { useEffect, useState } from 'react'
import './PersonalInfo.scss'
import Button from '../../Button/Button'

import Form from 'react-bootstrap/Form'
import Question from '../Question/Question';

const PersonalInfo = () => {

  const [totalSteps, SetTotalSteps] = useState(4);

  const [answers, setAnswers] = useState({
    isNameChanged: '',
    isAddressChanged: '',
    isDemographicInfoChanged: '',
    isContactInfoChanged: ''
  });

  useEffect(() => {
    console.log("These are the answers: ", answers)
  }, [answers])

  function handleNext() {
    let stepCount = 0
    let Steps = {}

    for (let key in answers) {
      if (answers[key] === 'Yes') {
        Steps[`Step${stepCount + 1}`] = key
        stepCount += 1;
      }
    }

    SetTotalSteps(() => stepCount)
    console.log("This is the step count: ", stepCount)
    console.log("This is the steps object: ", Steps)
  }

  return (
    <>
      <div className='personal-info-wrap'>
        <h2>Personal Information</h2>
        <div className='questions-wrap'>
          <div className="questions-wrap-1">
            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={0}
              questionTitle="Name"
              questionText="Has your name changed?"
            />

            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={1}
              questionTitle="Address"
              questionText="Do you need to update your address?"
            />
          </div>

          <div className="questions-wrap-2">
            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={2}
              questionTitle="Demographic Information"
              questionText="Do you need to update your height, weight, or eye color?"
            />

            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={3}
              questionTitle="Contact Information"
              questionText="Do you need to update your contact information?"
            />
          </div>

          <Button onClick={handleNext}> Next </Button>
        </div>
      </div>

      {answers['isNameChanged'] &&
        <div className='name-change-form-wrap'>
          <h2 className='form-title'>Name Change</h2>
          <Form className='name-change-form'>
            <Form.Group className='form-element'>
              <Form.Label>First Name</Form.Label>
              <Form.Control type='text' placeholder='Sam' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Middle Name</Form.Label>
              <Form.Control type='text' placeholder='' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type='text' placeholder='Sam' />
            </Form.Group>

            <Form.Group className='form-element'>
              <Form.Label>Suffix</Form.Label>
              <Form.Select>
                <option>Select an option</option>
              </Form.Select>
            </Form.Group>
          </Form>
          <Button>Next</Button>
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