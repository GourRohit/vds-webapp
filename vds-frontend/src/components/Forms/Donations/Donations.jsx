import React, { useState, useEffect } from 'react'
import './Donations.scss'

import Button from '../../Button/Button'
import Question from '../Question/Question';
import ChoiceButton from '../ChoiceButton/ChoiceButton'

const Donations = ({ step, setStep, setApplicationData }) => {
  const [answers, setAnswers] = useState({
    donationForEducationAid: '',
    donationForBlindnessPrevention: ''
  });

  const questions = Object.keys(answers);

  useEffect(() => {
    const storedDonationAnswers = sessionStorage.getItem('DonationAnswers');
    if (storedDonationAnswers) {
      setAnswers(JSON.parse(storedDonationAnswers))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('DonationAnswers', JSON.stringify(answers))
    console.log("These are the answers: ", answers)
  }, [answers])


  const handleChange = (e, question) => {
    const { name, value } = e.currentTarget;
    console.log("This is name value pair", value)
    console.log(`${question}: ${value}`)
    setAnswers((prevState) => ({
      ...prevState,
      [question]: value
    }))
  }

  function handleNext(e) {
    const form = e.currentTarget;
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }


    if (answers.donationForEducationAid === "$1" || answers.donationForEducationAid === "$5" || answers.donationForEducationAid === "$10") {
      setApplicationData((prevState) => ({
        ...prevState,
        DonationEducation: true,
        DonationBlindness: answers.donationForBlindnessPrevention === 'Yes' && true
      }))
    } else {
      setApplicationData((prevState) => ({
        ...prevState,
        DonationEducation: false,
        DonationBlindness: answers.donationForBlindnessPrevention === 'Yes' && true
      }))
    }

    setStep((step) => step + 1)
    console.log("This is the steps object: ", step)
  }

  return (
    <>
      <div className='donation-wrap'>
        <h2>Donations</h2>
        <div className='questions-wrap'>
          <form onSubmit={(e) => handleNext(e)}>
            <div className="questions-wrap-1">

              <div className='question'>
                <div className="question-text">
                  <p className='required'>
                    Do you want to donate to the Georgia Student Finance Authority for education aid to children whose parents are or were public safety employees and were disabled or killed in the line of duty?
                  </p>
                </div>

                <div className='choice-btn-wrap'>

                  <div>
                    <label>
                      <input
                        type="radio"
                        value="$1"
                        name="education-donation"
                        required={true}
                        className='btn-input'
                        checked={answers[questions[0]] === "$1" ? true : false}
                        onChange={(e) => handleChange(e, questions[0])}
                      />
                      <span
                        className={`form-btn ${answers[questions[0]] === '$1' ? 'primary' : 'secondary'}`}>
                        $1
                      </span>
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        type="radio"
                        value="$5"
                        name="education-donation"
                        required={true}
                        className='btn-input'
                        checked={answers[questions[0]] === "$5" ? true : false}
                        onChange={(e) => handleChange(e, questions[0])}
                      />
                      <span
                        className={`form-btn ${answers[questions[0]] === '$5' ? 'primary' : 'secondary'}`}>
                        $5
                      </span>
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        type="radio"
                        value="$10"
                        name="education-donation"
                        required={true}
                        className='btn-input'
                        checked={answers[questions[0]] === "$10" ? true : false}
                        onChange={(e) => handleChange(e, questions[0])}
                      />
                      <span
                        className={`form-btn ${answers[questions[0]] === '$10' ? 'primary' : 'secondary'}`}>
                        $10
                      </span>
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        name="education-donation"
                        required={true}
                        className='btn-input'
                        checked={answers[questions[0]] === "No" ? true : false}
                        onChange={(e) => handleChange(e, questions[0])}
                      />
                      <span
                        className={`form-btn ${answers[questions[0]] === 'No' ? 'primary' : 'secondary'}`}>
                        No
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <Question
                isRequired={true}
                answers={answers}
                setAnswers={setAnswers}
                questionIndex={1}
                questionTitle=""
                questionText="Do you want to donate $1 for blindness prevention?"
              />
            </div>

            <Button
              type="submit"
              disabled={(
                answers.donationForEducationAid === "" ||
                answers.donationForBlindnessPrevention === "") && true}
            > Next
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Donations