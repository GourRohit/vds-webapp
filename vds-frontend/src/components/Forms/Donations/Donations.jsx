import React, { useState, useEffect } from 'react'
import './Donations.scss'

import Button from '../../Button/Button'
import Question from '../Question/Question';
import ChoiceButton from '../ChoiceButton/ChoiceButton'

const Donations = () => {
  const [answers, setAnswers] = useState({
    donationForEducationAid: '',
    donationForBlindnessPrevention: ''
    ,
  });

  useEffect(() => {
    console.log("These are the answers: ", answers)
  }, [answers])

  const handleClick = (question, value) => {
    console.log(`${question}: ${value}`)
    setAnswers((prevState) => ({
      ...prevState,
      [question]: value
    }))
  }

  return (
    <>
      <div className='donation-wrap'>
        <h2>Donations</h2>
        <div className='questions-wrap'>
          <div className='question'>
            <div>
              <p>
                Do you want to donate to the Georgia Student Finance Authority for education aid to children whose parents are or were public safety employees and were disabled or killed in the line of duty?*
              </p>
            </div>

            <div className='choice-btn-wrap'>
              <ChoiceButton
                className={answers['donationForEducationAid'] === '1' ? 'primary' : 'secondary'}
                onClick={() => handleClick('donationForEducationAid', '1')}>
                $1
              </ChoiceButton>

              <ChoiceButton
                className={answers['donationForEducationAid'] === '5' ? 'primary' : 'secondary'}
                onClick={() => handleClick('donationForEducationAid', '5')}>
                $5
              </ChoiceButton>

              <ChoiceButton
                className={answers['donationForEducationAid'] === '10' ? 'primary' : 'secondary'}
                onClick={() => handleClick('donationForEducationAid', '10')}>
                $10
              </ChoiceButton>

              <ChoiceButton
                className={answers['donationForEducationAid'] === 'No' ? 'primary' : 'secondary'}
                onClick={() => handleClick('donationForEducationAid', 'No')}>
                No
              </ChoiceButton>
            </div>
          </div>

          <Question
            answers={answers}
            setAnswers={setAnswers}
            questionIndex={1}
            questionTitle=""
            questionText="Do you want to donate $1 for blindness prevention?"
          />
        </div>
        <Button> Next </Button>
      </div>
    </>
  )
}

export default Donations