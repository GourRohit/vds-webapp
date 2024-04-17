import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopHeader = () => {
  return (
    <Navbar className="header justify-content-between">
      <Navbar.Brand>
        <Link>
          <img
            src={require("../../assets/images/Georgia-logo.png")}
            id="GA-DDS-logo"
            alt="GA-DDS-Logo"
            width={203}
            height={72}
          />
        </Link>
      </Navbar.Brand>
      <Nav>
        <img
          src={require("../../assets/images/English-lang.png")}
          alt="English"
          width={125}
          height={53}
        />
      </Nav>
    </Navbar>
  )
}

export default TopHeader;