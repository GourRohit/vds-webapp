import React, { Component } from "react";
import { Navigate } from "react-router";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import moment from "moment";
import { VDS_URL } from "../../UrlConfig";
import { getReaderinfo, saveIdData } from "../../services/Utils";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";

class Dashboard extends Component {
  state = {
    deviceMode: "",
    deviceStatus: this.props.deviceStatus,
    recievedIdentityInfo: false,
    currentTime: null,
    firstName: "",
    lastName: "",
    docNumber: "",
    isDuplicate: false,
    showModal: false,
    isMdL: false,
    message: "",
    listening: false,
    checkinMessage: false,
    portrait: "",
  };

  buttonEnabled = () => {
    return (
      this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
      this.state.deviceMode === "HOST_DRIVEN"
    );
  };
  componentDidMount = () => {
    if(this.state.deviceStatus !== ""){
    getReaderinfo()
      .then((response) => {
        if (response.data && response.status) {
          localStorage.setItem("deviceMode", response.data.usbMode);
          this.setState({
            deviceMode: response.data.usbMode,
          });
          if (response.data.usbMode === "HOLDER_DRIVEN") {
            this.serverSentEvents();
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  serverSentEvents = () => {
    let time = moment().add(30, "m").format("LT");
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
            if (obj.docType === "IDENTITY") {
              saveIdData(obj.data)
                .then((res) => {
                  if (res.data && res.status) {
                    if (res.data.message === "success") {
                      this.setState({
                        message: ` Welcome ${obj.data.givenNames} ${obj.data.familyName}, you are checked in for
                    your ${time} appointment`,
                        portrait: obj.data.portrait,
                      });
                    } else if (res.data.message === "duplicate") {
                      this.setState({
                        message: ` Welcome ${obj.data.givenNames} ${obj.data.familyName}, we
                      could find that you are already checked in for appointment at ${res.data.appointmentTime}`,
                        portrait: res.data.portrait,
                      });
                    } else {
                      this.setState({
                        message: "",
                      });
                    }
                  }
                })
                .then(() => {
                  this.navigateToCheckinMessage();
                })
                .catch((err) => {
                  this.setState({
                    message: "Your check-in could not be completed",
                  });
                  this.navigateToCheckinMessage();
                });
            } else if (obj.docType === "QR_CODE") {
              this.setState({
                message: obj.data.qrCodeData,
              });
              this.navigateToCheckinMessage();
            }
          }
        },
        false
      );
      sse.onerror = function (event) {
        this.setState({
          message: "Could not establish connection with VDS",
        });
        this.navigateToCheckinMessage();
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("SSE closed (" + event.target.readyState + ")");
        }
        sse.close();
      };
      sse.onopen = (event) => {
        console.log("connection opened");
        this.setState({
          listening: true,
        });
      };
    }
  };

  navigateToCheckinMessage() {
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
          <Navigate to="checkin/message" state={this.state} />
        ) : null}
        {this.state.showModal && <Navigate to="/checkin" state={this.state} />}
        <div className="page-container">
          <p>Welcome to Mocktana Department of Motor Vehicles </p>
          {this.state.deviceMode !== "HOLDER_DRIVEN" && (
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
          {this.state.deviceMode === "HOLDER_DRIVEN" && (
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
                <h3 className="dashboard-name-text">QR Code</h3>
                <h3 className="dashboard-name-text">Physical ID</h3>
                <h3 className="dashboard-name-text">NFC</h3>
              </div>
            </>
          )}
          <div className="user-message-wrap">
            {this.state.deviceStatus === "NOT_CONNECTED" ? (
              <span className="error-msg">
                Please connect the device and try again
              </span>
            ) : this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
              this.state.deviceMode === "HOLDER_DRIVEN" &&
              this.state.message === "" ? (
              "Tap or scan your mobile DL or physical DL to check in"
            ) : this.state.deviceMode !== "HOLDER_DRIVEN" &&
              this.state.deviceMode !== "HOST_DRIVEN" &&
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
