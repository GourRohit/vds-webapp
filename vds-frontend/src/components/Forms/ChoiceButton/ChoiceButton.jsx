import React from 'react'
import './ChoiceButton.scss'

const Button = ({ className, disabled, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      className={`choice-btn ${className} ${disabled && 'disabled'}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button