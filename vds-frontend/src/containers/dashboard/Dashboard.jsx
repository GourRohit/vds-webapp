import React, { Component } from "react";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { API_URL } from "../../UrlConfig";
import InformationModal from "../../components/informationModal/InformationModal";
import Loader from "../../components/informationModal/Loader";
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
    isLoading: true,
    listening: false,
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
      this.serverSentEvents();
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

  saveIdData(data) {
    let time = moment().add(30, "m").format("LT");
    const idData = {
      documentNumber: data.documentNumber,
      currentTime: time,
    };
    axios
      .post(`${API_URL}/data`, idData)
      .then((res) => {
        if (res.data && res.status) {
          if (res.data.message === "success") {
            this.setState({
              isLoading: false,
              message: ` Welcome ${data.givenNames} ${data.familyName}, you are checked in for 
              your ${time} appointment`,
            });
          } else if (res.data.message === "duplicate") {
            this.setState({
              isLoading: false,
              message: ` Welcome ${data.givenNames} ${data.familyName}, we
                could find that you are already checked in for appointment at ${res.data.appointmentTime}`,
            });
          }
          this.setState({
            isLoading: false,
            message: "",
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          message: "Failed to checkin. Error received",
        });
      });
  }

  serverSentEvents = () => {
    if (!this.state.listening) {
      const sse = new EventSource(
        "http://localhost:8081/verifier-sdk/sse/read"
      );
      console.log("SSE response", sse);
      sse.addEventListener(
        "SCANNED_DATA",
        (event) => {
          let obj = JSON.parse(event.data);
          console.log("parsed e.data obj", obj);
          if (obj) {
            this.setState({
              recievedIdentityInfo: true,
            });
            this.saveIdData(obj);
          }
        },
        false
      );
      sse.onerror = function (event) {
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("SSE closed (" + event.target.readyState + ")");
        }
        sse.close();
      };
      sse.onopen = (event) => {
        console.log("connection opened");
      };
      this.setState({
        listening: true,
      });
    }
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
            <p>{this.state.isLoading ? <Loader /> : this.state.message}</p>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
