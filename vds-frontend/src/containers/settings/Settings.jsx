import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Header from "../header/Header";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { VDS_URL, BASE_URL } from "../../UrlConfig";
import { Link } from "react-router-dom";

class Settings extends Component {
  state = {
    deviceStatus: localStorage.getItem("deviceStatus"),
    readerData: [],
    isData: false,
    deviceMode: localStorage.getItem("deviceMode"),
  };

  getReaderinfo = (isData) => {
    axios
      .get(`${VDS_URL}/reader/info`)
      .then((response) => {
        if (response.data) {
          this.setState({
            readerData: response.data,
            isData: isData,
            deviceStatus: response.data.deviceState,
            deviceMode: response.data.usbMode,
          });
        } else {
          this.setState({
            readerData: [],
            isData: false,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          readerData: [],
          isData: false,
        });
      });
  };
  changeMode = (value) => {
    axios
      .post(`${VDS_URL}/reader/properties`, {
        setting: "USB_mode",
        value: {
          mode: value,
        },
      })
      .then((response) => {
        if (response.status) {
          this.setState({
            deviceMode: value,
          });
          localStorage.setItem("deviceMode", value);
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
      .catch(function (error) {
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
  };
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
  handleClearBtn = () => {
    confirmAlert({
      title: "Do you want to clear data?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.clearData(),
        },
        {
          label: "No",
        },
      ],
    });
  };
  clearData = () => {
    axios
      .delete(`${BASE_URL}/data`)
      .then((res) => {
        if (res.status) {
          confirmAlert({
            title: "Checkin data cleared successfully",
            buttons: [
              {
                label: "Ok",
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          title: "Failed to clear checkin data",
          buttons: [
            {
              label: "Ok",
            },
          ],
        });
      });
  };
  render() {
    return (
      <>
        <Header />
        <Container>
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
                    : "NOT CONNECTED"}
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
                    value="ID_READ_EVENT_DRIVEN"
                    disabled={this.state.deviceStatus !== "CONNECTED_AOA_MODE"}
                    checked={
                      this.state.deviceMode === "ID_READ_EVENT_DRIVEN" &&
                      "checked"
                    }
                    onClick={(e) => this.handleRadioBtn(e)}
                  />
                  <label for="iddriven" className="radio-label">
                    ID_READ_EVENT_DRIVEN
                  </label>
                  <br />
                  <input
                    type="radio"
                    id="usbdriven"
                    name="mode"
                    value="USB_EVENT_DRIVEN"
                    disabled={this.state.deviceStatus !== "CONNECTED_AOA_MODE"}
                    checked={
                      this.state.deviceMode === "USB_EVENT_DRIVEN" && "checked"
                    }
                    onClick={(e) => this.handleRadioBtn(e)}
                  />
                  <label for="usbdriven" className="radio-label">
                    USB_EVENT_DRIVEN
                  </label>
                  <br />
                  <input
                    type="radio"
                    id="stand"
                    name="mode"
                    value="STANDALONE"
                    disabled={this.state.deviceStatus !== "CONNECTED_AOA_MODE"}
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
                    value="E-SEEK"
                    disabled={this.state.deviceStatus !== "CONNECTED_AOA_MODE"}
                    checked={this.state.deviceMode === "E-SEEK" && "checked"}
                    onClick={(e) => this.handleRadioBtn(e)}
                  />
                  <label for="eseek" className="radio-label">
                    E-SEEK
                  </label>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row className="btn-row">
                <Col md={7} className="reader-info-btn">
                  <Button
                    className="info-btn"
                    onClick={() => this.getReaderinfo(true)}
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
                <Col md={5}>
                  <Button variant="primary" onClick={this.handleClearBtn}>
                    Clear Checkin Data
                  </Button>
                </Col>
              </Row>
              <Row className={this.state.isData ? "info-box" : ""}>
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
        </Container>
      </>
    );
  }
}
export default Settings;
