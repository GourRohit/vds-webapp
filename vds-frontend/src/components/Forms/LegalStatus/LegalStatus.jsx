import React, { useEffect, useState } from 'react'
import './LegalStatus.scss'

import Button from '../../Button/Button'
import Question from '../Question/Question';

const LegalStatus = () => {
  const [answers, setAnswers] = useState({
    isUSCitizen: ''
  });

  useEffect(() => {
    console.log("These are the answers: ", answers)
  }, [answers])

  return (
    <>
      <div className='legal-status-wrap'>
        <h2>Legal Status</h2>
        <div className='questions-wrap'>
          <Question
            answers={answers}
            setAnswers={setAnswers}
            questionIndex={0}
            questionTitle=""
            questionText="Are you a United States Citizen?"
          />
        </div>

        <Button> Next </Button>
      </div>
    </>
  )
}

export default LegalStatus