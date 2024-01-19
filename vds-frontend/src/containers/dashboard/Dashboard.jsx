import React, { Component } from "react";
import { Navigate } from "react-router";
import { FadeLoader } from "react-spinners";
import Header from "../header/Header";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { VDS_URL } from "../../UrlConfig";
import { getReaderinfo, saveIdData, stopInfo } from "../../services/Utils";
import QRGIF1 from "../../assets/images/Verification_using_QR.gif";
import QRGIF2 from "../../assets/images/Verification_using_NFC.gif";
import physicalIMG from "../../assets/images/DL_Scan_Back.png";
import moment from 'moment';
let sse;

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
    isLoading: false,
  };

  buttonEnabled = () => {
    return (
      this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
      this.state.deviceMode === "HOST_DRIVEN"
    );
  };
  componentDidMount = () => {
    let localIdInfo = localStorage.getItem("identityInfoAPIInvoked");
    this.setState({
      isLoading: true,
    });
    if (localIdInfo === "true") {
      stopInfo()
        .then(() => {
          localStorage.setItem("identityInfoAPIInvoked", false);
          this.readerInfo();
        })
        .catch((error) => {
          localStorage.setItem("identityInfoAPIInvoked", false);
          console.error(error);
        });
    }
    // checking this condition for first time rendering, we get initial empty deviceStatus
    // before we get deviceStatus API response and getReaderInfo API was getting called twice
    else if (this.state.deviceStatus !== "") {
      this.readerInfo();
    }
  };

  readerInfo = async () => {
    return getReaderinfo()
      .then((response) => {
        if (response.data && response.status) {
          localStorage.setItem("deviceMode", response.data.usbMode);
          localStorage.setItem("readerProfile", response.data.readerProfile.toLowerCase())
          this.setState({
            deviceMode: response.data.usbMode,
            isLoading: false,
          });
          if (response.data.usbMode === "HOLDER_DRIVEN") {
            this.serverSentEvents();
          }
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        // confirmAlert({
        //   title: "Some error occured, Please reload the window and try again",
        //   buttons: [
        //     {
        //       label: "Reload",
        //       onClick: () => window.location.reload(),
        //     },
        //   ],
        // });
        // console.error(error);
      });
  };

  componentWillUnmount() {
    if (this.state.deviceMode === "HOLDER_DRIVEN") {
      this.closeSSEConnection();
    }
  }

  closeSSEConnection = () => {
    if (sse) {
      sse.close();
      this.setState({ listening: false });
    }
  };

  serverSentEvents = () => {
    if (!this.state.listening) {
      sse = new EventSource(`${VDS_URL}/sse/read`);
      sse.addEventListener(
        "SCANNED_DATA",
        (event) => {
          let obj = JSON.parse(event.data);
          if (obj) {
            this.setState({
              recievedIdentityInfo: true,
            });
            if (obj.docType === "IDENTITY") {
              if (obj.data.documentNumber === "") {
                if (obj.data.isAgeOver21 === true) {
                  this.setState({
                    message: "Your age has been verified and it is above 21 years",
                    portrait: obj.data.portrait
                  });
                } else if (obj.data.isAgeOver18 === true) {
                  this.setState({
                    message: "Your age has been verified and it is above 18 years",
                    portrait: obj.data.portrait
                  });
                } else {
                  this.setState({
                    message: "You have been checked in successfully",
                  });
                }
                this.navigateToCheckinMessage();
              } else {
                saveIdData(obj.data)
                  .then((res) => {
                    if (res.data && res.status) {
                      let UTCTime = parseInt(res.data.appointmentTime);
                      let date = new Date(UTCTime);
                      let appointmentTime = moment(date.getTime()).format("h:mm A");
                      if (res.data.message === "success") {
                        this.setState({
                          message: ` Welcome ${obj.data.givenNames} ${obj.data.familyName}, you are checked in for
                    your ${appointmentTime} appointment`,
                          portrait: obj.data.portrait,
                        });
                      } else if (res.data.message === "duplicate") {
                        this.setState({
                          message: ` Welcome ${obj.data.givenNames} ${obj.data.familyName}, we
                      could find that you are already checked in for appointment at ${appointmentTime}`,
                          portrait: obj.data.portrait,
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
              }
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

      sse.addEventListener("ERROR_DATA", (event) => {
        this.setState({
          message: "Your check-in could not be completed",
        });
        this.navigateToCheckinMessage();
      });

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

  handleButtonClick = (isMdl) => {
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
        <div
          className="loader-overlay"
          style={{
            zIndex: this.state.isLoading ? 10 : -10,
          }}>
          {this.state.isLoading ? <FadeLoader color="#1aff66" /> : null}
        </div>
        <div
          style={{
            opacity: this.state.isLoading ? 0.25 : 1,
            pointerEvents: this.state.isLoading ? "none" : "auto",
          }}
        >
          <Header />
          {this.state.checkinMessage ? (
            <Navigate to="/checkin/message" state={this.state} />
          ) : null}
          {this.state.showModal && (
            <Navigate to="/checkin" state={this.state} />
          )}
          <div className="page-container">
            <p>Welcome to Mocktana Department of Transportation </p>
            {this.state.deviceMode !== "HOLDER_DRIVEN" && (
              <div className="button-wrap">
                <Button
                  variant={this.buttonEnabled() ? "primary" : "secondary"}
                  onClick={() => this.handleButtonClick(false)}
                  disabled={!this.buttonEnabled()}
                  className="db-button"
                >
                  Check in with <br />{" "}
                  <span className="big-text">Physical DL</span>
                </Button>
                <Button
                  variant={this.buttonEnabled() ? "primary" : "secondary"}
                  onClick={() => this.handleButtonClick(true)}
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
                  <img
                    className="dashboard-img"
                    src={QRGIF1}
                    alt="qr-gif"
                  ></img>
                  <img
                    className="dashboard-img"
                    src={physicalIMG}
                    alt="physicalImg"
                  ></img>
                  <img
                    className="dashboard-img"
                    src={QRGIF2}
                    alt="nfc-gif"
                  ></img>
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
              ) : (this.state.deviceMode === "STANDALONE" ||
                this.state.deviceMode === "VELOCIRAPTOR") &&
                this.state.deviceStatus === "CONNECTED_AOA_MODE" ? (
                "Please change the device operation mode to activate reading"
              ) : (
                ""
              )}
              {this.state.deviceStatus === "VDS_NOT_RUNNING" && (
                <span className="error-msg">VDS is not running</span>
              )}
              {this.state.deviceStatus === "CONNECTED_USB_DEBUG_ENABLED" && (
                <span className="error-msg">Tap2iD is in ADB mode</span>
              )}
              {this.state.deviceStatus === "CONNECTED_USB_DEBUG_DISABLED" && (
                <span className="error-msg">Tap2iD is not in AOA mode</span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
