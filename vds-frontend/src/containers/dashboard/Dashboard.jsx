import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import InformationModal from "../../components/informationModal/InformationModal";
import { awsUrl } from "../../UrlConfig";
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
    showModal: false,
    isMdL: false,
    message: "",
  };

  buttonEnabled = () => {
    return (
      this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
      this.state.deviceMode === "USB_EVENT_DRIVEN"
    );
  };

  componentDidMount = () => {
    this.getDeviceMode();
  };

  componentDidMount = () => {
    this.inerval = setInterval(() => {
      this.getDeviceStatus();
    }, 5000);
  };

  componentDidMount = () => {
    if (this.state.deviceMode === "ID_READ_EVENT_DRIVEN") {
      const sse = new EventSource(
        "http://localhost:8081/verifier-sdk/sse/read"
      );
      sse.addEventListener("SCANNED_DATA", function (e) {
        let time = moment().add(30, "m").format("LT");
        //console.log(e.data);
        if (e.data) {
          this.setState({
            recievedIdentityInfo: true,
            currentTime: time,
            firstName: e.data.data.givenNames,
            lastName: e.data.data.familyName,
            docNumber: e.data.data.documentNumber,
          });
          this.saveIdData(e.data);
        }
      });
      sse.onerror = function () {
        alert("Server connection closed");
        sse.close();
      };
    }
  };

  saveIdData(data) {
    const idData = {
      documentNumber: data.data.documentNumber,
    };
    axios
      .post(`${awsUrl}/data`, idData)
      .then((res) => {
        console.log("response from saveData", res);
        if (res.data && res.status) {
          if (res.data.message === "success") {
            this.setState({
              message: ` Welcome ${data.givenNames} ${data.familyName}, you are checked in for 
            your ${data.time} appointment.`,
            });
          } else if (res.data.message === "duplicate") {
            this.setState({
              message: ` Welcome ${data.givenNames} ${data.familyName}, we
              could find that you are already checked in.`,
            });
          } else {
            this.setState({
              message: "",
            });
          }
        }
      })
      .catch((err) => {
        this.setState({
          message: `Failed to checkin. Error received: ${err}`,
        });
        // console.error("error response", err);
        // return "failed";
      });
  }

  getDeviceMode = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/reader/info")
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceMode: response.data.usbMode,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getDeviceStatus = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/reader/connection/status")
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceStatus: response.data.deviceState,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getIdentityInfo = (isMdl) => {
    this.setState({ isMdL: isMdl });
    this.handleModal(true);
  };
  handleModal = (value) => {
    this.setState({
      showModal: value,
    });
  };
  render() {
    return (
      <>
        <Header></Header>
        {this.state.showModal && (
          <InformationModal
            show={this.state.showModal}
            modalclose={this.handleModal}
            isMobileDLCheck={this.state.isMdL}
            message={this.state.message}
          ></InformationModal>
        )}
        <div className="page-container">
          <p>Welcome to Mocktana Department of Motor Vehicles </p>
          <div className="button-wrap">
            <Button
              variant={this.buttonEnabled() ? "primary" : "secondary"}
              onClick={() => this.getIdentityInfo(false)}
              disabled={!this.buttonEnabled()}
              className="db-button"
            >
              Check in with <br /> <span className="big-text">Physical DL</span>
            </Button>
            <Button
              variant={this.buttonEnabled() ? "primary" : "secondary"}
              onClick={() => this.getIdentityInfo(true)}
              disabled={!this.buttonEnabled()}
              className="db-button"
            >
              Check in with <br /> <span className="big-text"> Mobile DL</span>
            </Button>
          </div>
          <div className="user-message-wrap">
            <p className="error-msg">
              {this.state.deviceStatus === "NOT_CONNECTED"
                ? "Please connect the device and try again."
                : this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
                  this.state.deviceMode === "ID_READ_EVENT_DRIVEN"
                ? "Tap or scan your mobile DL or physical DL to check in"
                : this.state.deviceMode !== "ID_READ_EVENT_DRIVEN" &&
                  this.state.deviceMode !== "USB_EVENT_DRIVEN"
                ? "Please switch the device to “autonomous or host trigger mode” to start scanning"
                : ""}
            </p>
          </div>
          <div>
            <p>{this.state.message}</p>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
