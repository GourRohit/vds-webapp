import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopHeader = () => {
  return (
    <Navbar className="header justify-content-between px-5 py-5">
      <Navbar.Brand>
        <Link>
          <img
            src={require("../../assets/images/Georgia-logo.png")}
            alt="GA-DDS-Logo"
            width={200}
          />
        </Link>
      </Navbar.Brand>
      <Nav>
        <img src={require("../../assets/images/English-lang.png")} alt="" width={100} />
      </Nav>
    </Navbar>
  )
}

export default TopHeader;