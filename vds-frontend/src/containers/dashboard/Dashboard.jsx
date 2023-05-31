import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import InformationModal from "../../components/informationModal/InformationModal";
import { saveIdData } from "../../utils/SaveIdData";
let INTERVAL = null;

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
    this.getDeviceInfo();
  };

  getDeviceInfo = async() => {
    await this.getDeviceMode();
    INTERVAL = setInterval(async() => {
    await this.getDeviceStatus();
    }, 5000);
    await this.serverSentEvents();
  }

  getDeviceMode = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/reader/info")
      .then((response) => {
        if (response.data && response.status) {
          console.log("Response.data device mode", response.data)
          console.log("Response.data.usb device mode", response.data.usbMode)
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
          console.log("Device status if", response.data.deviceState)
          this.setState({
            deviceStatus: response.data.deviceState,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  serverSentEvents = () => {
    console.log("device mode", this.state.deviceMode);
    if (this.state.deviceMode === "ID_READ_EVENT_DRIVEN") {
      console.log("in ID_EVENT_DRIVEN_IF")
      const sse = new EventSource(
        "http://localhost:8081/verifier-sdk/sse/read"
      );
      console.log("SSE response", sse)
      sse.addEventListener("SCANNED_DATA", function (e) {
        if (e.data) {
          let messageResponse = saveIdData(e.data);
          console.log("MESSAGE_RESPONSE", messageResponse)
          this.setState({
            recievedIdentityInfo: true,
            message: messageResponse
          });
        }
      });
      sse.onerror = function () {
        alert("Server connection closed");
        sse.close();
      };
    }
  }

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
