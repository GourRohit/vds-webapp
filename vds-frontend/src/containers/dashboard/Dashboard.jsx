import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import InformationModal from "../../components/informationModal/InformationModal";
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
    this.getDeviceMode();
    INTERVAL = setInterval(() => {
      this.getDeviceStatus();
    }, 5000);
    // setTimeout(() => {
    //   this.serverSentEvents();
    // }, 6000)
  };

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

  // serverSentEvents = () => {
  //   console.log("device mode", this.state.deviceMode);
  //     const sse = new EventSource(
  //       "http://localhost:8081/verifier-sdk/sse/read",
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log("SSE response", sse);
  //     sse.onmessage = function (e) {
  //       console.log("from add event listener e.data", e.data);
  //       let obj = JSON.parse(e.data);
  //       console.log("parsed e.data obj", obj)
  //       let pretty = JSON.stringify(obj, undefined, 4);
  //       console.log("stringify pretty", pretty)
  //       document.getElementById("idInfo").value = pretty;

  //       if (obj) {
  //         let messageResponse = saveIdData(obj);
  //         console.log("MESSAGE_RESPONSE", messageResponse);
  //         this.setState({
  //           recievedIdentityInfo: true,
  //           message: messageResponse,
  //         });
  //       }
  //     };
  //     sse.onerror = function () {
  //       alert("Server connection closed");
  //       sse.close();
  //     };
  // };

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
