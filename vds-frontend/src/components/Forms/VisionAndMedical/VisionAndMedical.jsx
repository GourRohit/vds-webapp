import React, { useEffect, useState } from 'react'
import './VisionAndMedical.scss'

import Button from '../../Button/Button'
import Question from '../Question/Question';


const VisionAndMedical = ({ step, setStep, setApplicationData }) => {
  const [answers, setAnswers] = useState({
    wearGlasses: '',
    showBloodType: '',
    seizuresFainting: '',
    showOrganDonor: ''
  });

  useEffect(() => {
    const storedVisionAndMedicalAnswers = sessionStorage.getItem('VisionAndMedicalAnswers');
    if (storedVisionAndMedicalAnswers) {
      setAnswers(JSON.parse(storedVisionAndMedicalAnswers))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('VisionAndMedicalAnswers', JSON.stringify(answers))
    console.log("These are the answers: ", answers)
  }, [answers])


  function handleNext(e) {
    const form = e.currentTarget;
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setApplicationData((prevState) => ({
      ...prevState,
      CorrectiveLenses: answers.wearGlasses === 'Yes' && true,
      BloodTypeDisplay: answers.showBloodType === 'Yes' && true,
      SeizuresFainting: answers.seizuresFainting === 'Yes' && true,
      OrganDonor: answers.showOrganDonor === 'Yes' && true
    }))

    setStep((step) => step + 1)
    console.log("This is the steps object: ", step)
  }

  return (
    <>
      <div className='vision-and-medical-wrap'>
        <h2>Vision and Medical</h2>
        <div className='questions-wrap'>

          <form onSubmit={(e) => handleNext(e)}>
            <div className="questions-wrap-1">
              <Question
                disabled={true}
                isRequired={true}
                answers={answers}
                setAnswers={setAnswers}
                questionIndex={0}
                questionTitle=""
                questionText="Do you wear glasses or contact lenses for driving?"
              />

              <Question
                disabled={true}
                isRequired={true}
                answers={answers}
                setAnswers={setAnswers}
                questionIndex={1}
                questionTitle=""
                questionText="Do you wish your blood type displayed on the card?"
              />
            </div>

            <div className="questions-wrap-2">
              <Question
                disabled={true}
                isRequired={true}
                answers={answers}
                setAnswers={setAnswers}
                questionIndex={2}
                questionTitle=""
                questionText="Have you suffered: Seizures, fainting or loss of consciousness?"
              />

              <Question
                disabled={true}
                isRequired={true}
                answers={answers}
                setAnswers={setAnswers}
                questionIndex={3}
                questionTitle=""
                questionText="Do you wish to display ‘Organ Donor’ displayed on your card or ID?"
              />
            </div>

            <Button
              type='submit'
              disabled={(
                answers.wearGlasses === "" ||
                answers.showBloodType === "" ||
                answers.seizuresFainting === "" ||
                answers.showOrganDonor === "") && true}
            >
              Next
            </Button>
          </form>

        </div>
      </div>
    </>
  )
}

export default VisionAndMedical