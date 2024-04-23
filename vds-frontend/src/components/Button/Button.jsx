import React from 'react'
import './Button.scss'

const Button = ({ type, className, disabled, onClick, children }) => {
  return (
    <button
      type={type}
      className={`action-btn ${className} ${disabled && 'disabled'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button