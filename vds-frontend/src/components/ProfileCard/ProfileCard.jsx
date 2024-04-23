import React from 'react'
import './ProfileCard.scss'

const ProfileCard = ({ dlData }) => {
  const issueDate = new Date(dlData.data.issueDate);
  const formatedIssueDate = issueDate.toLocaleDateString('en-US');

  const expiryDate = new Date(dlData.data.expiryDate);
  const formatedExpiryDate = expiryDate.toLocaleDateString('en-US');

  return (
    <div className='profile-card'>
      <div className='profile-img-container'>
        <img src={require("../../assets/images/user.png")} alt="user image" />
      </div>

      <div className='profile-data-container'>
        <div className="id-attribute">Name: {`${dlData.data.givenNames} ${dlData.data.familyName}` || "Sam Paatricks"}</div>
        <div className="id-attribute">DOB: {dlData.data.birthDate || "12/03/1986"}</div>
        <div className="id-attribute">Sex: {dlData.data.sex || "Male"}</div>
        <div className="id-attribute">Height: {dlData.data.height || "5’- 11”"} </div>
        <div className="id-attribute">Eyes: {dlData.data.eyeColor || "Brown"} </div>
        <div className="id-attribute">Hair: {dlData.data.hairColor || "Brown"} </div>
        <div className="id-attribute">Weight: {dlData.data.weight || "160 lb"} </div>
        <div className="id-attribute">Address: {`${dlData.data.residentAddress}, ${dlData.data.residentCity}, ${dlData.data.residentCountry} ${dlData.data.residentPostalCode}` || "555 Madison Ave, Anytown, GA 39999"} </div>
        <div className="id-attribute">ID: {dlData.data.documentNumber || "DF65054VDD"}</div>
        <div className="id-attribute">Expiry: {formatedExpiryDate || "04/05/2033"} </div>
        <div className="id-attribute">ISS: {formatedIssueDate || "04/05/2018"}</div>
        <div className="id-attribute">Class: {dlData.data.drivingPrivileges[0].vehicleCategory || 'C'} </div>
        <div className="id-attribute">Issuing Authority: {dlData.data.issuingAuthority || "GA-DDS"} </div>
      </div>
    </div>
  )
}

export default ProfileCard