import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from "../../containers/header/Header";

function CheckinMessage() {
  let navigate = useNavigate();
  const [time, setTime] = useState(false);
  const location = useLocation();
  const message = location.state.message;
  const portrait = location.state.portrait;
  console.log("data", location);
  useEffect(() => {
    setTimeout(() => {
      setTime(true);
    }, 7000);
    setTime(false);
  }, []);
  return (
    <>
      {time ? navigate("/") : navigate("checkin/message")}
      <Header />
      {portrait !== "" && (
        <div className="portrait">
          <img className="portrait-img" src={portrait} alt="portrait" />
        </div>
      )}
      <div
        className={
          portrait === ""
            ? "checkin-message-no-portrait"
            : "checkin-message-portrait"
        }
      >
        <div
          className={
            message === "Your check-in could not be completed"
              ? "checkin-error-message"
              : "checkin-message"
          }
        >
          {message}
        </div>
      </div>
      <div className="done-btn">
        <Button onClick={() => navigate("/")} size="lg" variant="primary">
          Done
        </Button>
      </div>
    </>
  );
}

export default CheckinMessage;
