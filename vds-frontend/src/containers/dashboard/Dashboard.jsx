import React, { Component } from "react";
import { Navigate } from "react-router";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { API_URL, VDS_URL } from "../../UrlConfig";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
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
    isError: false,
    listening: false,
    checkinMessage: false,
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
      .get(`${VDS_URL}/reader/info`)
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceMode: response.data.usbMode,
          });
          localStorage.setItem("deviceMode", this.state.deviceMode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getDeviceStatus = () => {
    axios
      .get(`${VDS_URL}/reader/connection/status`)
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceStatus: response.data.deviceState,
          });
          localStorage.setItem("deviceStatus", this.state.deviceStatus);
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
      .post(`${API_URL}data`, idData)
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
          } else {
            this.setState({
              isLoading: false,
              message: "",
            });
          }
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          message: "Check-in Failed",
        });
        this.navigateToCheckinMessage(this.state.message);
      });
  }

  serverSentEvents = () => {
    if (!this.state.listening) {
      const sse = new EventSource(`${VDS_URL}/sse/read`);
      sse.addEventListener(
        "SCANNED_DATA",
        (event) => {
          let obj = JSON.parse(event.data);
          if (obj) {
            this.setState({
              recievedIdentityInfo: true,
            });
            this.saveIdData(obj.data);
            setTimeout(() => {
              this.navigateToCheckinMessage(this.state.message);
            }, 1000);
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

  navigateToCheckinMessage(message) {
    console.log("in navigate checkin message", message);
    this.setState({
      checkinMessage: true,
    });
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
        {this.state.checkinMessage ? (
          <Navigate to="checkin/message" state={this.state.message} />
        ) : null}
        {this.state.showModal && <Navigate to="/checkin" state={this.state} />}
        <div className="page-container">
          <p>Welcome to Mocktana Department of Motor Vehicles </p>
          {this.state.deviceMode !== "ID_READ_EVENT_DRIVEN" && (
            <div className="button-wrap">
              <Button
                variant={this.buttonEnabled() ? "primary" : "secondary"}
                onClick={() => this.getIdentityInfo(false)}
                disabled={!this.buttonEnabled()}
                className="db-button"
              >
                Check in with <br />{" "}
                <span className="big-text">Physical DL</span>
              </Button>
              <Button
                variant={this.buttonEnabled() ? "primary" : "secondary"}
                onClick={() => this.getIdentityInfo(true)}
                disabled={!this.buttonEnabled()}
                className="db-button"
              >
                Check in with <br />{" "}
                <span className="big-text"> Mobile DL</span>
              </Button>
            </div>
          )}
          {this.state.deviceMode === "ID_READ_EVENT_DRIVEN" && (
            <>
              <div className="dashboard-image-wrap">
                <img className="dashboard-img" src={QRGIF1} alt="qr-gif"></img>
                <img
                  className="dashboard-img"
                  src={physicalIMG}
                  alt="physicalImg"
                ></img>
                <img className="dashboard-img" src={QRGIF2} alt="nfc-gif"></img>
              </div>
              <div className="dashboard-name-wrap">
                <h3>QR Code Presentation</h3>
                <h3>Physical ID Presentation</h3>
                <h3>NFC Presentation</h3>
              </div>
            </>
          )}
          <div className="user-message-wrap">
            {this.state.deviceStatus === "NOT_CONNECTED" ? (
              <span className="error-msg">
                Please connect the device and try again
              </span>
            ) : this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
              this.state.deviceMode === "ID_READ_EVENT_DRIVEN" &&
              this.state.message === "" ? (
              "Tap or scan your mobile DL or physical DL to check in"
            ) : this.state.deviceMode !== "ID_READ_EVENT_DRIVEN" &&
              this.state.deviceMode !== "USB_EVENT_DRIVEN" &&
              this.state.deviceStatus === "CONNECTED_AOA_MODE" ? (
              "Please change the device operation mode to activate reading"
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
