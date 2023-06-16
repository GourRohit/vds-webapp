import React, { useEffect, useState } from "react";
//import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import axios from "axios";
import { VDS_URL } from "./UrlConfig";
import Dashboard from "./containers/dashboard/Dashboard";
import Settings from "./containers/settings/Settings";
import InformationModal from "./components/informationModal/InformationModal";
import CheckinMessage from "./components/informationModal/CheckinMessage";

function App() {
  const [ deviceStatus, setDeviceStatus ] = useState("");
  useEffect(() => {
    getDeviceStatus();
    setInterval(() => {
      getDeviceStatus();
    }, 5000);
  });
  const getDeviceStatus = () => {
    axios
      .get(`${VDS_URL}/reader/connection/status`)
      .then((response) => {
        if (response.data && response.status) {
          setDeviceStatus(response.data.deviceState);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={(props) => <Dashboard deviceStatus={deviceStatus} {...props}/>} />
          <Route exact path="/dashboard" Component={(props) => <Dashboard deviceStatus={deviceStatus} {...props}/>} />
          <Route exact path="dashboard/settings" Component={(props) => <Settings deviceStatus={deviceStatus} {...props}/>} />
          <Route exact path="/checkin" element={<InformationModal />} />
          <Route exact path="/checkin/message" element={<CheckinMessage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
