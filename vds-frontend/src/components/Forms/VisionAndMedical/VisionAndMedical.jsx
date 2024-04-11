import React, { useEffect, useState } from 'react'
import './VisionAndMedical.scss'

import Button from '../../Button/Button'
import Question from '../Question/Question';

const VisionAndMedical = () => {
  const [answers, setAnswers] = useState({
    wearGlasses: '',
    showBloodType: '',
    SeizuresFainting: '',
    showOrganDonor: ''
  });

  useEffect(() => {
    console.log("These are the answers: ", answers)
  }, [answers])

  return (
    <>
      <div className='vision-and-medical-wrap'>
        <h2>Vision and Medical</h2>
        <div className='questions-wrap'>
          <div className="questions-wrap-1">
            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={0}
              questionTitle=""
              questionText="Do you wear glasses or contact lenses for driving?"
            />

            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={1}
              questionTitle=""
              questionText="Do you wish your blood type displayed on the card?"
            />
          </div>

          <div className="questions-wrap-2">
            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={2}
              questionTitle=""
              questionText="Have you suffered: Seizures, fainting or loss of consciousness?"
            />

            <Question
              answers={answers}
              setAnswers={setAnswers}
              questionIndex={3}
              questionTitle=""
              questionText="Do you wish to display ‘Organ Donor’ displayed on your card or ID?"
            />
          </div>

          <Button> Next </Button>
        </div>
      </div>
    </>
  )
}

export default VisionAndMedical