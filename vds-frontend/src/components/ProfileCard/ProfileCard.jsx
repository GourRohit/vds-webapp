import React from 'react'
import './ProfileCard.scss'

const ProfileCard = () => {
  return (
    <div className='profile-card'>
      <div className='profile-img-container'>
        <img src={require("../../assets/images/user.png")} alt="user image" />
      </div>

      <div className='profile-data-container'>
        <div className="id-attribute">Name: Sam Patricks</div>
        <div className="id-attribute">DOB: 12/03/1986</div>
        <div className="id-attribute">Sex: Male</div>
        <div className="id-attribute">Height: 5’- 11”</div>
        <div className="id-attribute">Eyes: Brown</div>
        <div className="id-attribute">Hair: Brown</div>
        <div className="id-attribute">Weight: 160 lb</div>
        <div className="id-attribute">Address: 555 Madison Ave, Anytown, GA 39999 </div>
        <div className="id-attribute">ID: DF65054VDD</div>
        <div className="id-attribute">Expiry: 04/05/2033</div>
        <div className="id-attribute">ISS: 04/05/2018</div>
        <div className="id-attribute">Class: C</div>
        <div className="id-attribute">Issue State:  Georgia</div>
      </div>
    </div>
  )
}

export default ProfileCard