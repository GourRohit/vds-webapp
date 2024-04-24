import React from 'react'
import './DashboardButton.scss'

const DashboardButton = ({ onClick, children }) => {
  return (
    <button className='db-btn' onClick={onClick}>
      {children}
    </button>
  )
}

export default DashboardButton