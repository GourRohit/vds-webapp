import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Header from "../header/Header";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Settings extends Component {
  state = {
    deviceStatus: "",
    readerData: [],
    isData: false,
    deviceMode: "",
  };
  getReaderinfo = () => {
    axios
      .get("http://localhost:8081/verifier-sdk/reader/info")
      .then((response) => {
        if (response.data) {
          this.setState({
            readerData: response.data,
            isData: true,
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
      .post("http://localhost:8081/verifier-sdk/reader/properties", {
        setting: "USB_mode",
        value: {
          mode: value,
        },
      })
      .then((response) => {
        if (response.data && response.status) {
          this.setState({
            deviceMode: value,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  handleRadioBtn = (e) => {
    confirmAlert({
      title: "Do you want to switch to " + `${e.target.value}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => this.changeMode(e.target.value),
        },
        {
          label: "No",
          //onClick: () => alert('Click No')
        },
      ],
    });
  };
  clearData = () => {
    axios
      .delete("http://localhost:3000/data")
      .then((res) => {
        if (res.status) {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return (
      <>
        <Header />
        <Container>
          <Row>
            <Col md={5}>
              <Row style={{ marginTop: "165px" }}>
                <Col md={4}>
                  <p className="setting-label">
                    <strong>Device Mode: </strong>
                  </p>
                </Col>
                <Col md={6} className="text-align-left">
                  <input
                    type="radio"
                    id="iddriven"
                    name="mode"
                    value="ID_READ_EVENT_DRIVEN"
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
                    value="E-Seek"
                    checked={this.state.deviceMode === "E-Seek" && "checked"}
                    onClick={(e) => this.handleRadioBtn(e)}
                  />
                  <label for="eseek" className="radio-label">
                    E-Seek
                  </label>
                </Col>
              </Row>
              <Row>
                <div>
                  <Button variant="primary" onClick={this.clearData}>
                    Clear Data
                  </Button>
                </div>
              </Row>
            </Col>
            <Col md={7}>
              <Row>
                <Col md={6} style={{ marginTop: "165px" }}>
                  <p>
                    <strong>Device Status :</strong>
                    <img
                      className="status-btn"
                      src={
                        this.state.deviceStatus === "CONNECTED"
                          ? require("../../assets/images/connected.png")
                          : require("../../assets/images/disconnected.png")
                      }
                      height={15}
                      alt="connectionStatus"
                    />{" "}
                    {this.state.deviceStatus}
                  </p>
                </Col>

                <Col md={6} style={{ marginTop: "160px" }}>
                  <p>
                    <strong>Device Info:</strong>
                    <Button
                      className="info-btn"
                      onClick={this.getReaderinfo}
                      variant={
                        this.state.deviceStatus === "CONNECTED"
                          ? "primary"
                          : "secondary"
                      }
                      disabled={this.state.deviceStatus === "NOT_CONNECTED"}
                    >
                      Fetch Reader Info
                    </Button>
                  </p>
                </Col>
              </Row>
              <Row className={this.state.isData ? "info-box" : ""}>
                {this.state.deviceStatus === "CONNECTED" ? (
                  <Col md={6}>
                    {Object.keys(this.state.readerData).map((item, i) => (
                      <Row className="reader-info">
                        <Col md={6}>
                          <p>{item + ":"}</p>
                        </Col>
                        <Col md={6}>
                          <p className="reader-response">
                            {this.state.readerData[item] !== null
                              ? this.state.readerData[item]
                              : "Unvailable"}
                          </p>
                        </Col>
                      </Row>
                    ))}
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
