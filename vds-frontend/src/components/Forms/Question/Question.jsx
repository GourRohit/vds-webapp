import React from 'react'
import './Question.scss'

const Question = ({ disabled, isRequired, answers, setAnswers, questionIndex, questionTitle, questionText }) => {
  const questions = Object.keys(answers);

  const handleChange = (e, question) => {
    const { name, value } = e.currentTarget;
    console.log("This is name value pair", value)
    console.log(`${question}: ${value}`)
    setAnswers((prevState) => ({
      ...prevState,
      [question]: value
    }))
  }

  return (
    <div className='question'>
      <div>
        <p className={`question-text ${isRequired && 'required'}`}>
          <strong>{questionTitle && `${questionTitle}: `}</strong>
          {questionText}
        </p>
      </div>

      <div className='choice-btn-wrap'>
        <div>
          <label>
            <input
              type="radio"
              value="Yes"
              disabled={disabled}
              className={`btn-input`}
              name={questions[questionIndex]}
              checked={answers[questions[questionIndex]] === "Yes" ? true : false}
              onChange={(e) => handleChange(e, questions[questionIndex])}
            />
            <span
              className={`form-btn ${answers[questions[questionIndex]] === 'Yes' ? 'primary' : 'secondary'} ${disabled && 'disabled'}`}>
              Yes
            </span>
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="No"
              name={questions[questionIndex]}
              required={isRequired}
              className='btn-input'
              checked={answers[questions[questionIndex]] === "No" ? true : false}
              onChange={(e) => handleChange(e, questions[questionIndex])}
            />
            <span
              className={`form-btn ${answers[questions[questionIndex]] === 'No' ? 'primary' : 'secondary'}`}>
              No
            </span>
          </label>
        </div>
      </div>

    </div>
  )
}

export default Question