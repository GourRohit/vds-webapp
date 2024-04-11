import React from 'react'
import './ChoiceButton.scss'

const Button = ({ className, onClick, children }) => {
  return (
    <button
      className={`choice-btn ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button