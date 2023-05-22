import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";

class Header extends Component {
  render() {
    return (
      <>
        <Navbar bg="light" expand="lg" className="navbar-wrap" fixed="top">
          <Container fluid>
            <Navbar.Brand href="/">
              <img
                src={require("../../assets/images/credenceid-logo.png")}
                alt="CredenceId-Logo"
              />
            </Navbar.Brand>
            <Nav className="me-auto navBar-linkwrap">
              <Nav.Link href="/">
                <img
                  src={require("../../assets/images/mid-logo.png")}
                  alt="MID-LOGO"
                  className="mid-logo"
                />
                <label className="mid-label">
                  Welcome to Mocktana Department of Motors
                </label>
              </Nav.Link>
              <Nav.Link href="/dashboard/settings">
                <label className="setting-label">Settings</label>
                <img
                  src={require("../../assets/images/setting.png")}
                  alt="setting-LOGO"
                  className="setting-icon"
                />
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}
export default Header;
