import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
//import { Container } from "react-bootstrap";

class Dashboard extends Component {
  state = {
    deviceMode: "",
    deviceStatus: "",
    recievedIdentityInfo: false,
    currentTime: null,
    firstName: "",
    lastName: "",
    docNumber: "",
    isDuplicate: false,
  };

  buttonEnabled = () => {
    return (
      this.state.deviceStatus === "CONNECTED" &&
      this.state.deviceMode === "USB_EVENT_DRIVEN"
    );
  };

  componentDidMount = () => {
    this.getDeviceinfo();
    var time = moment().add(30, "m").format("LT");
    if (this.state.deviceMode === "ID_READ_EVENT_DRIVEN") {
      const sse = new EventSource(
        "http://localhost:8081/verifier-sdk/sse/read"
      );
      sse.addEventListener("SCANNED_DATA", function (e) {
        //console.log(e.data);
        if (e.data) {
          this.setState({
            currentTime: time,
            firstName: e.data.data.givenNames,
            lastName: e.data.data.familyName,
            docNumber: e.data.data.documentNumber,
          });
          this.saveIdData();
        }
      });
    }
  };
  saveIdData = () => {
    //const { firstName, lastName } = {"Stefan", "doe"}
    const idData = {
      documentNumber: this.state.docNumber,
      // firstName: this.state.firstName,
      // lastName: this.state.lastName,
      // checkIn: this.state.currentTime,
    };
    axios
      .post("http://localhost:3001/data", idData)
      .then((res) => {
        if (res.data && res.status) {
          if (res.data.message === "Saved Sucessfully") {
            this.setState({
              isDuplicate: false,
            });
          } else {
            this.setState({
              isDuplicate: true,
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  getDeviceinfo = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/reader/info")
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceStatus: response.data.deviceState,
            deviceMode: response.data.usbMode,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getIdentityInfo = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/identity/info")
      .then((response) => {
        if (response.data) {
          var time = moment().add(30, "m").format("LT");
          this.setState(
            {
              recievedIdentityInfo: true,
              currentTime: time,
              firstName: response.data.givenNames,
              lastName: response.data.familyName,
              docNumber: response.data.documentNumber,
            },
            this.saveIdData()
          );
        } else {
          this.setState({
            recievedIdentityInfo: false,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return (
      <>
        <Header></Header>
        <div className="page-container">
          <p>
            Welcome to Mocktana department of motor vehicles. This is a sample
            App to check in using physical or digital license. Click on the
            following button to proceed{" "}
          </p>
          <div className="button-wrap">
            <Button
              variant={this.buttonEnabled() ? "primary" : "secondary"}
              onClick={() => this.getIdentityInfo()}
              disabled={!this.buttonEnabled()}
            >
              Check in with Physical DL
            </Button>
            <Button
              variant={this.buttonEnabled() ? "primary" : "secondary"}
              onClick={() => this.getIdentityInfo()}
              disabled={!this.buttonEnabled()}
            >
              Check in with Mobile DL
            </Button>
          </div>
          <div className="user-message-wrap">
            <p className="error-msg">
              {this.state.deviceStatus === "NOT_CONNECTED"
                ? "Please connect the device and try again."
                : this.state.deviceStatus === "CONNECTED" &&
                  this.state.deviceMode === "ID_READ_EVENT_DRIVEN"
                ? "Tap or scan your mobile DL or physical DL to check in"
                : this.state.deviceMode !== "ID_READ_EVENT_DRIVEN" &&
                  this.state.deviceMode !== "USB_EVENT_DRIVEN"
                ? "Please switch the device to “autonomous or host trigger mode” to start scanning"
                : ""}
            </p>
            {this.state.recievedIdentityInfo && (
              <>
                {this.state.isDuplicate ? (
                  <p className="info-message">
                    Welcome Mr. {this.state.firstName} {this.state.lastName}, we
                    could find an appointment for you, you are checked in to the
                    walk-in line {this.state.currentTime}
                  </p>
                ) : (
                  <p className="info-message">
                    Welcome Mr. {this.state.firstName} {this.state.lastName} ,
                    you are checked in for your {this.state.currentTime}{" "}
                    appointment
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
