import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <>
        <Navbar bg="light" expand="lg" className="navbar-wrap" fixed="top">
          <Container fluid>
            <Navbar.Brand>
              <Link to="/">
                <img
                  src={require("../../assets/images/credenceid-logo.png")}
                  alt="CredenceId-Logo"
                />
              </Link>
            </Navbar.Brand>
            <Nav className="me-auto navBar-linkwrap">
              <Link to="/">
                <img
                  src={require("../../assets/images/DMV_Logo.png")}
                  alt="MID-LOGO"
                  className="mid-logo"
                />
              </Link>
              <Link className="setting-link" to="/dashboard/settings">
                <label className="setting-label">Settings</label>
                <img
                  src={require("../../assets/images/setting.png")}
                  alt="setting-LOGO"
                  className="setting-icon"
                />
              </Link>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}
export default Header;
