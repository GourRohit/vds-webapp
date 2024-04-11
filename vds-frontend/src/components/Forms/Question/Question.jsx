import React from 'react'
import './Question.scss'
import ChoiceButton from '../ChoiceButton/ChoiceButton'

const Question = ({ answers, setAnswers, questionIndex, questionTitle, questionText }) => {
  const questions = Object.keys(answers);

  const handleClick = (question, value) => {
    console.log(`${question}: ${value}`)
    setAnswers((prevState) => ({
      ...prevState,
      [question]: value
    }))
  }

  return (
    <div className='question'>
      <div>
        <p>
          <strong>{questionTitle && `${questionTitle}: `}</strong>
          {questionText}
        </p>
      </div>

      <div className='choice-btn-wrap'>
        <ChoiceButton
          className={answers[questions[questionIndex]] === 'Yes' ? 'primary' : 'secondary'}
          onClick={() => handleClick(questions[questionIndex], 'Yes')}>
          Yes
        </ChoiceButton>

        <ChoiceButton
          className={answers[questions[questionIndex]] === 'No' ? 'primary' : 'secondary'}
          onClick={() => handleClick(questions[questionIndex], 'No')}>
          No
        </ChoiceButton>
      </div>
    </div>
  )
}

export default Question