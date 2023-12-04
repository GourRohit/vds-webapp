import React, { Component } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from "../header/Header";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import {
  getReaderinfo,
  setUsbMode,
  stopInfo,
  setReaderProfile,
  setWifiSSID
} from "../../services/Utils";

class Settings extends Component {
  state = {
    deviceStatus: this.props.deviceStatus,
    readerData: [],
    isData: false,
    deviceMode: localStorage.getItem("deviceMode"),
    readerProfile: localStorage.getItem("readerProfile"),
    isLoading: false,
    isReaderInfoLoading: false,
    wifiFormData: {
      wifiSSID: "",
      wifiPassword: "",
    },
    wifiFormError: {},
    showPassword: false,
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
    this.setState({
      isLoading: true,
    });
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
  };

  getReaderData() {
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
            readerProfile: response.data.readerProfile.toLowerCase(),
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
  }

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

  changeProfile(profile) {
    this.setState({
      isLoading: true,
    });
    // Reader profiles mapping
    let readerProfile = {
      "id check profile": "ID_CHECK",
      "age check profile": "AGE_CHECK",
      "custom profile": "CUSTOM_CHECK"
    };
    setReaderProfile(readerProfile[profile])
      .then((response) => {
        if (response.status) {
          this.setState({
            readerProfile: profile
          })
          localStorage.setItem("readerProfile", profile);
          confirmAlert({
            title: "Reader profile successfully changed",
            buttons: [
              {
                label: "Ok",
              },
            ],
          });
        }
        this.setState({
          isLoading: false,
        });
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

  changeWifi(wifiSetting) {
    this.setState({
      isLoading: true,
    });
    setWifiSSID(wifiSetting)
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        if (response.status) {
          this.setState({
            wifiFormData: {
              wifiSSID: "",
              wifiPassword: "",
            }
          })
          confirmAlert({
            title: "Wifi SSID successfully changed",
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
          title: "Failed to change wifi setting",
          buttons: [
            {
              label: "Ok",
            },
          ],
        });
        console.log(error);
      })
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

  // Function to handle the input fields (SSID and password) in Wifi Form
  handleWifiChange = (e) => {
    const { name, value } = e.target
    const { wifiFormData } = this.state
    this.setState({
      wifiFormData: {
        ...wifiFormData,
        [name]: value
      }
    })
  }

  // Validating input and then making Post request for Wifi form
  handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = {}
    const { wifiFormData } = this.state

    if (wifiFormData.wifiSSID.trim() === "") {
      validationErrors.SSIDError = "Wifi SSID is required!"
    }

    if (wifiFormData.wifiPassword.trim() === "") {
      validationErrors.passwordError = "Wifi Password is required!"
    }

    this.setState({ wifiFormError: validationErrors })

    if (Object.keys(validationErrors).length === 0) {
      const wifiSetting = {}
      wifiSetting.SSID = this.state.wifiFormData.wifiSSID
      wifiSetting.password = this.state.wifiFormData.wifiPassword

      this.changeWifi(wifiSetting)
    }
  }

  // Function to toggle the visibility of password
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
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
                <ul className="breadcrumb">
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

              <Row>
                <Col md={12} className="status-container">
                  <div>
                    <h4>Tap2iD Verifier</h4>
                    <div className="status-wrap">
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
                          : "Tap2iD NOT CONNECTED"
                      }
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="col-wrap">
                <Col lg={6}>
                  <div className="verifier-info-wrap">
                    <h5>Tap2iD Verifier Info</h5>
                    <Row className={this.state.isData ? "info-box" : ""}>
                      {this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
                        this.state.isData ? (
                        <Col md={12}>
                          {this.state.isReaderInfoLoading ? (
                            <div className="settings-fade-loader">
                              <FadeLoader color="#b3ffcc" />
                            </div>
                          ) : <Table hover size="sm">
                            <tbody>
                              {Object.keys(this.state.readerData).map((item, i) => {
                                const words = item.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
                                const result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                return (
                                  <tr key={item}>
                                    <td>{result + ":"}</td>
                                    <td>
                                      {this.state.readerData[item] !== null
                                        ? this.state.readerData[item].toString()
                                        : "Unvailable"}
                                    </td>
                                  </tr>
                                )
                              })
                              }
                            </tbody>
                          </Table>}
                        </Col>
                      ) : (
                        <Col md={12}>
                          <div className="reader-info-container">
                            {this.state.isReaderInfoLoading ? (
                              <FadeLoader color="#b3ffcc" />
                            ) : <Button
                              className="info-btn"
                              onClick={() => this.getReaderData()}
                              variant={
                                this.state.deviceStatus === "CONNECTED_AOA_MODE"
                                  ? "primary"
                                  : "secondary"
                              }
                              disabled={this.state.deviceStatus === "NOT_CONNECTED"}
                            >
                              Fetch Reader Info
                            </Button>
                            }
                          </div>
                        </Col>
                      )}
                    </Row>

                    <div>
                      {(this.state.deviceStatus === "CONNECTED_AOA_MODE" &&
                        this.state.isData) && (
                          <Button
                            className="info-btn"
                            onClick={() => this.getReaderData()}
                            variant={
                              this.state.deviceStatus === "CONNECTED_AOA_MODE"
                                ? "primary"
                                : "secondary"
                            }
                            disabled={this.state.deviceStatus === "NOT_CONNECTED"}
                          >
                            Fetch Reader Info
                          </Button>
                        )}
                    </div>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="general-settings-wrap">
                    <h5>General Settings</h5>

                    <div className="device-mode-wrap">
                      <p><strong>Device Mode :</strong></p>
                      <div className="radio-options-wrap">
                        <div className="radio-option-wrap">
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
                            onChange={(e) => this.handleRadioBtn(e)}
                          />
                          <label htmlFor="iddriven" className="radio-label">
                            HOLDER_DRIVEN
                          </label>
                        </div>

                        <div className="radio-option-wrap">
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
                            onChange={(e) => this.handleRadioBtn(e)}
                          />
                          <label htmlFor="usbdriven" className="radio-label">
                            HOST_DRIVEN
                          </label>
                        </div>

                        <div className="radio-option-wrap">
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
                            onChange={(e) => this.handleRadioBtn(e)}
                          />
                          <label htmlFor="stand" className="radio-label">
                            STANDALONE
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="reader-profile-wrap">
                      <p><strong>Reader Profile:</strong></p>
                      <div className="radio-options-wrap">
                        <div className="radio-option-wrap">
                          <input
                            type="radio"
                            id="idcheck"
                            name="profile"
                            value="id check profile"
                            disabled={
                              this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                            }
                            checked={
                              (this.state.readerProfile === "id check profile") && "checked"
                            }
                            onChange={(e) => this.handleReaderProfileRadioBtn(e)}
                          />
                          <label htmlFor="idcheck" className="radio-label">
                            ID_CHECK
                          </label>
                        </div>

                        <div className="radio-option-wrap">
                          <input
                            type="radio"
                            id="agecheck"
                            name="profile"
                            value="age check profile"
                            checked={
                              (this.state.readerProfile === "age check profile") && "checked"
                            }
                            disabled={
                              this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                            }
                            onChange={(e) => this.handleReaderProfileRadioBtn(e)}
                          />
                          <label htmlFor="agecheck" className="radio-label">
                            AGE_CHECK
                          </label>
                        </div>

                        <div className="radio-option-wrap">
                          <input
                            type="radio"
                            id="customcheck"
                            name="profile"
                            value="custom profile"
                            checked={
                              (this.state.readerProfile === "custom profile") && "checked"
                            }
                            disabled={
                              this.state.deviceStatus !== "CONNECTED_AOA_MODE"
                            }
                            onChange={(e) => this.handleReaderProfileRadioBtn(e)}
                          />
                          <label htmlFor="customcheck" className="radio-label">
                            CUSTOM_CHECK
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="wifi-settings-wrap">
                    <h5>Wifi Settings</h5>
                    <form action="" onSubmit={(e) => this.handleSubmit(e)}>
                      <Row className="input-wrap">
                        <Col md={3}><label htmlFor="wifi-ssid">Wi-Fi SSID: </label></Col>
                        <Col md={9}>
                          <input
                            type="text"
                            name="wifiSSID"
                            id="wifi-ssid"
                            className="wifi-input"
                            value={this.state.wifiFormData.wifiSSID}
                            onChange={(e) => this.handleWifiChange(e)}
                          /> <br />
                          {this.state.wifiFormError.SSIDError && <div className="wifi-error-message">{this.state.wifiFormError.SSIDError}</div>}
                        </Col>
                      </Row>

                      <Row className="input-wrap">
                        <Col md={3}><label htmlFor="wifi-ssid">Wi-Fi Password: </label></Col>
                        <Col md={9}>
                          <input
                            type={this.state.showPassword ? 'text' : 'password'}
                            name="wifiPassword"
                            id="wifi-password"
                            className="wifi-input"
                            value={this.state.wifiFormData.wifiPassword}
                            onChange={(e) => this.handleWifiChange(e)}
                          />
                          <span
                            className="password-toggle"
                            onClick={this.togglePasswordVisibility}
                          >
                            {this.state.showPassword ? <FaEye /> : <FaEyeSlash />}
                          </span>
                          <br />
                          {this.state.wifiFormError.passwordError && <div className="wifi-error-message">{this.state.wifiFormError.passwordError}</div>}
                        </Col>
                      </Row>

                      <Row>
                        <Col md="3"><label htmlFor="wifi-type">Wi-Fi Type: </label></Col>
                        <Col md="9">
                          <Form.Select id="wifi-type">
                            <option value="">None</option>
                            <option value="">WEP</option>
                            <option value="">WAP</option>
                          </Form.Select>
                        </Col>
                      </Row>

                      <Button
                        type="submit"
                        className="save-btn"
                      >Save</Button>
                    </form>
                  </div>
                </Col>
              </div>
            </Row>
          </div>
        </Container>
      </>
    );
  }
}
export default Settings;
