import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import Header from "../header/Header";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import {
  getReaderinfo,
  setUsbMode,
  stopInfo,
  setReaderProfile
} from "../../services/Utils";

class Settings extends Component {
  state = {
    deviceStatus: this.props.deviceStatus,
    readerData: [],
    isData: false,
    deviceMode: localStorage.getItem("deviceMode"),
    isLoading: false,
    isReaderInfoLoading: false,
  };

  componentDidMount = () => {
    let localIdInfo = localStorage.getItem("identityInfoAPIInvoked");
    if (localIdInfo === "true") {
      stopInfo()
        .then(() => {
          localStorage.setItem("identityInfoAPIInvoked", false);
        })
        .catch((error) => {
          localStorage.setItem("identityInfoAPIInvoked", false);
          console.error(error);
        });
    }
  };

  changeMode(deviceMode) {
    this.setState({
      isLoading: true,
    });
    setUsbMode(deviceMode)
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        if (response.status) {
          this.setState({
            deviceMode: deviceMode,
          });
          localStorage.setItem("deviceMode", deviceMode);
          confirmAlert({
            title: "Device mode successfully changed",
            buttons: [
              {
                label: "Ok",
              },
            ],
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        confirmAlert({
          title: "Failed to change device mode",
          buttons: [
            {
              label: "Ok",
            },
          ],
        });
        console.log(error);
      });
  }
  
  changeProfile(readerProfile) {
    this.setState({
      isLoading: true,
    });
    setReaderProfile(readerProfile)
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        if (response.status) {
          confirmAlert({
            title: "Reader profile successfully changed",
            buttons: [
              {
                label: "Ok",
              },
            ],
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        confirmAlert({
          title: "Failed to change reader profile",
          buttons: [
            {
              label: "Ok",
            },
          ],
        });
        console.log(error);
      });
  }

  handleRadioBtn = (e) => {
    let deviceMode = e.target.value;
    confirmAlert({
      title: `Do you want to switch to ${e.target.value}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => this.changeMode(deviceMode),
        },
        {
          label: "No",
        },
      ],
    });
  };

  handleReaderProfileRadioBtn = (e) => {
    let readerProfile = e.target.value;
    confirmAlert({
      title: `Do you want to switch to ${e.target.value}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => this.changeProfile(readerProfile),
        },
        {
          label: "No",
        },
      ],
    });
  }

  render() {
    return (
      <>
        <Header />
        <Container>
          <div
            style={{
              opacity: this.state.isLoading ? 0.25 : 1,
              pointerEvents: this.state.isLoading ? "none" : "auto",
            }}
          >
            <Row>
              <div className="settings-breadcrumb">
                <ul class="breadcrumb">
                  <li>
                    <Link className="breadcrumb-text" to="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="breadcrumb-text" to="/dashboard/settings">
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
              <Col md={6}>
                <Row className="device-status">
                  <Col md={3}>
                    <strong>Device Status :</strong>
                  </Col>
                  <Col md={9}>
                    <img
                      className="status-btn"
                      src={
                        this.state.deviceStatus === "CONNECTED_AOA_MODE"
                          ? require("../../assets/images/connected_.png")
                          : require("../../assets/images/not_connected.png")
                      }
                      height={15}
                      alt="connectionStatus"
                    />{" "}
                    {this.state.deviceStatus === "CONNECTED_AOA_MODE"
                      ? "CONNECTED"
                      : this.state.deviceStatus === "VDS_NOT_RUNNING"
                      ? "VDS NOT RUNNING"
                      : "Tap2iD NOT CONNECTED"}
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <p>
                      <strong>Device Mode :</strong>
                    </p>
                  </Col>
                  <Col md={9} className="text-align-left">
                    <input
                      type="radio"
                      id="iddriven"
                      name="mode"
                      value="HOLDER_DRIVEN"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      checked={
                        this.state.deviceMode === "HOLDER_DRIVEN" && "checked"
                      }
                      onClick={(e) => this.handleRadioBtn(e)}
                    />
                    <label for="iddriven" className="radio-label">
                      HOLDER_DRIVEN
                    </label>
                    <br />
                    <input
                      type="radio"
                      id="usbdriven"
                      name="mode"
                      value="HOST_DRIVEN"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      checked={
                        this.state.deviceMode === "HOST_DRIVEN" && "checked"
                      }
                      onClick={(e) => this.handleRadioBtn(e)}
                    />
                    <label for="usbdriven" className="radio-label">
                      HOST_DRIVEN
                    </label>
                    <br />
                    <input
                      type="radio"
                      id="stand"
                      name="mode"
                      value="STANDALONE"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      checked={
                        this.state.deviceMode === "STANDALONE" && "checked"
                      }
                      onClick={(e) => this.handleRadioBtn(e)}
                    />
                    <label for="stand" className="radio-label">
                      STANDALONE
                    </label>
                    <br />
                    <input
                      type="radio"
                      id="eseek"
                      name="mode"
                      value="VELOCIRAPTOR"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      checked={
                        this.state.deviceMode === "VELOCIRAPTOR" && "checked"
                      }
                      onClick={(e) => this.handleRadioBtn(e)}
                    />
                    <label for="eseek" className="radio-label">
                      VELOCIRAPTOR
                    </label>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={3}>
                    <p>
                      <strong>Reader Profile :</strong>
                    </p>
                  </Col>
                  <Col md={9} className="text-align-left">
                    <input
                      type="radio"
                      id="idcheck"
                      name="profile"
                      value="ID_CHECK"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      onClick={(e) => this.handleReaderProfileRadioBtn(e)}
                    />
                    <label for="idcheck" className="radio-label">
                      ID_CHECK
                    </label>
                    <br />

                    <input
                      type="radio"
                      id="agecheck"
                      name="profile"
                      value="AGE_CHECK"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      onClick={(e) => this.handleReaderProfileRadioBtn(e)}
                    />
                    <label for="agecheck" className="radio-label">
                      AGE_CHECK
                    </label>
                    <br />

                    <input
                      type="radio"
                      id="customcheck"
                      name="profile"
                      value="CUSTOM_CHECK"
                      disabled={
                        this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                      }
                      onClick={(e) => this.handleReaderProfileRadioBtn(e)}
                    />
                    <label for="customcheck" className="radio-label">
                      CUSTOM_CHECK
                    </label>
                    <br />
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row className="btn-row">
                  <Col md={12} className="reader-info-btn">
                    <Button
                      className="info-btn"
                      onClick={() => {
                        this.setState({
                          isReaderInfoLoading: true,
                        });
                        getReaderinfo()
                          .then((response) => {
                            if (response.data) {
                              this.setState({
                                readerData: response.data,
                                isData: true,
                                deviceStatus: response.data.deviceState,
                                deviceMode: response.data.usbMode,
                                isReaderInfoLoading: false,
                              });
                            } else {
                              this.setState({
                                readerData: [],
                                isData: false,
                              });
                            }
                          })
                          .catch((error) => {
                            this.setState({
                              isReaderInfoLoading: false,
                              readerData: [],
                              isData: false,
                            });
                            confirmAlert({
                              title:
                                "Some error occured, Please reload the window and try again",
                              buttons: [
                                {
                                  label: "Reload",
                                  onClick: () => window.location.reload(),
                                },
                              ],
                            });
                            console.error(error);
                          });
                      }}
                      variant={
                        this.state.deviceStatus === "CONNECTED_AOA_MODE"
                          ? "primary"
                          : "secondary"
                      }
                      disabled={this.state.deviceStatus === "NOT_CONNECTED"}
                    >
                      Fetch Reader Info
                    </Button>
                  </Col>
                </Row>
                <Row className={this.state.isData ? "info-box" : ""}>
                  <div className="settings-fade-loader">
                    {this.state.isReaderInfoLoading ? (
                      <FadeLoader color="#b3ffcc" />
                    ) : null}
                  </div>
                  {this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
                  this.state.isData ? (
                    <Col md={12}>
                      <Table hover size="sm">
                        <tbody>
                          {Object.keys(this.state.readerData).map((item, i) => (
                            <tr>
                              <td>{item + ":"}</td>
                              <td>
                                {this.state.readerData[item] !== null
                                  ? this.state.readerData[item].toString()
                                  : "Unvailable"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  ) : null}
                </Row>
              </Col>
            </Row>
            <Row className="spinner">
              {this.state.isLoading ? <FadeLoader color="#1aff66" /> : null}
            </Row>
          </div>
        </Container>
      </>
    );
  }
}
export default Settings;
