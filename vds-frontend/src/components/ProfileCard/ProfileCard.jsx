import React from 'react'
import moment from 'moment'
import './ProfileCard.scss'

const ProfileCard = ({ dlData }) => {

  const issueDate = dlData.data.issueDate ?
    moment(parseInt(dlData.data.issueDate * 1000)).format('MM/DD/YYYY') : "";

  const expiryDate = dlData.data.expiryDate ?
    moment(parseInt(dlData.data.expiryDate * 1000)).format('MM/DD/YYYY') : "";

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

  const portrait = `data:image/webp;base64,${dlData.data.portrait}`;

  return (
    <div className='profile-card'>
      <div className='profile-img-container'>
        <img src={portrait === "data:image/webp;base64," ? require("../../assets/images/No-user-portrait.png") : portrait} alt="user image" />
      </div>

      <div className='profile-data-wrap'>
        <div className='profile-data-wrap-1'>
          <div className="id-attribute">
            <span>Name: {`${dlData.data.givenNames} ${dlData.data.familyName}` || ""}</span>
          </div>
          <div className="id-attribute">
            <span>DOB: {dlData.data.birthDate || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Sex: {dlData.data.sex || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Height: {dlData.data.height || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Eyes: {dlData.data.eyeColor || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Hair: {dlData.data.hairColor || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Weight: {dlData.data.weight || ""}</span>
          </div>
        </div>

        <div className='profile-data-wrap-2'>
          <div className="id-attribute">
            <span>Address: {`${dlData.data.residentAddress} ${dlData.data.residentCity} ${dlData.data.residentState} ${dlData.data.residentCountry} ${dlData.data.residentPostalCode}` || ""}</span>
          </div>
          <div className="id-attribute">
            <span>ID: {dlData.data.documentNumber || ""}</span>
          </div>
          <div className="id-attribute">
            <span>Expiry: {expiryDate || ""}</span>
          </div>
          <div className="id-attribute">
            <span>ISS: {issueDate || ""}</span>
          </div>
          <div className="id-attribute">
            Class: {dlData.data.drivingPrivileges.length !== 0 ? (dlData.data.drivingPrivileges[0].vehicleCategory || 'C') : ""}
          </div>
          <div className="id-attribute">
            <span>Issuing Authority: {dlData.data.issuingAuthority || ""} </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileCard