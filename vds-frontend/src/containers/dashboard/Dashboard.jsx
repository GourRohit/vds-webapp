import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import InformationModal from "../../components/informationModal/InformationModal";
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
            recievedIdentityInfo: true,
            currentTime: time,
            firstName: e.data.data.givenNames,
            lastName: e.data.data.familyName,
            docNumber: e.data.data.documentNumber,
          });
          //this.saveIdData();
        }
      });
    }
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
        <InformationModal
          show={this.state.showModal}
          modalclose={this.handleModal}
          isMobileDLCheck={this.state.isMdL}
          message={this.state.message}
        ></InformationModal>
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
                : this.state.deviceStatus === "CONNECTED" &&
                  this.state.deviceMode === "ID_READ_EVENT_DRIVEN"
                ? "Tap or scan your mobile DL or physical DL to check in"
                : this.state.deviceMode !== "ID_READ_EVENT_DRIVEN" &&
                  this.state.deviceMode !== "USB_EVENT_DRIVEN"
                ? "Please switch the device to “autonomous or host trigger mode” to start scanning"
                : ""}
            </p>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
