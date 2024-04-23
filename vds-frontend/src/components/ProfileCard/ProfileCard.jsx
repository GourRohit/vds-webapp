import React from 'react'
import './ProfileCard.scss'

const ProfileCard = ({ dlData }) => {
  const issueDate = new Date(dlData.data.issueDate);
  const formatedIssueDate = issueDate.toLocaleDateString('en-US');

  const expiryDate = new Date(dlData.data.expiryDate);
  const formatedExpiryDate = expiryDate.toLocaleDateString('en-US');

  const {
    givenNames,
    familyName,
    birthDate,
    sex,
    height,
    eyeColor,
    weight,
    residentAddress,
    residentCity,
    residentCountry,
    residentPostalCode,
    documentNumber,
    drivingPrivileges,
    issuingAuthority
  } = dlData.data;

  return (
    <div className='profile-card'>
      <div className='profile-img-container'>
        <img src={require("../../assets/images/user.png")} alt="user image" />
      </div>

      <div className='profile-data-container'>
        <div className="id-attribute">Name: {`${dlData.data.givenNames} ${dlData.data.familyName}` || ""}</div>
        <div className="id-attribute">DOB: {dlData.data.birthDate || ""}</div>
        <div className="id-attribute">Sex: {dlData.data.sex || ""}</div>
        <div className="id-attribute">Height: {dlData.data.height || ""} </div>
        <div className="id-attribute">Eyes: {dlData.data.eyeColor || ""} </div>
        <div className="id-attribute">Hair: {dlData.data.hairColor || ""} </div>
        <div className="id-attribute">Weight: {dlData.data.weight || ""} </div>
        <div className="id-attribute">Address: {`${dlData.data.residentAddress} ${dlData.data.residentCity} ${dlData.data.residentCountry} ${dlData.data.residentPostalCode}` || ""} </div>
        <div className="id-attribute">ID: {dlData.data.documentNumber || ""}</div>
        <div className="id-attribute">Expiry: {formatedExpiryDate || ""} </div>
        <div className="id-attribute">ISS: {formatedIssueDate || ""}</div>
        <div className="id-attribute">Class: {dlData.data.drivingPrivileges.length !== 0 ? (dlData.data.drivingPrivileges[0].vehicleCategory || 'C') : ""} </div>
        <div className="id-attribute">Issuing Authority: {dlData.data.issuingAuthority || ""} </div>
      </div>
    </div>
  )
}

export default ProfileCard