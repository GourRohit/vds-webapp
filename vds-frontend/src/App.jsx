import "./App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { getDeviceStatus } from "./services/Utils";
import Home from "./pages/Home/Home"
import Dashboard from "./pages/Dashboard/Dashboard";
import Checkin from "./pages/Checkin/Checkin";
import IdDetails from "./pages/IdDetails/IdDetails";
import CheckinMessage from "./pages/CheckinMessage/CheckinMessage";

function App() {
  const [deviceStatus, setDeviceStatus] = useState("");
  useEffect(() => {
    fetchDeviceStatus();
    const interval = setInterval(() => {
      fetchDeviceStatus();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  });

  const fetchDeviceStatus = () => {
    getDeviceStatus()
      .then((response) => {
        if (response.data && response.status) {
          setDeviceStatus(response.data.deviceState);
        }
      })
      .catch((error) => {
        console.log("ERROR", error)
        if (error.message === "Network Error") {
          setDeviceStatus("VDS_NOT_RUNNING")
        }
      });
  };

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            Component={(props) => (
              <Home deviceStatus={deviceStatus} {...props} />
            )}
          />

          <Route
            exact
            path="/dashboard"
            Component={(props) => (
              <Dashboard deviceStatus={deviceStatus} {...props} />
            )}
          />

          <Route
            exact
            path="/checkin"
            Component={(props) => (
              <Checkin deviceStatus={deviceStatus} {...props} />
            )}
          />

          <Route
            exact
            path="/checkin/message"
            Component={(props) => (
              <CheckinMessage deviceStatus={deviceStatus} {...props} />
            )}
          />

          <Route
            exact
            path="/id"
            Component={(props) => (
              <IdDetails deviceStatus={deviceStatus} {...props} />
            )}
          />

          {/* <Route exact path="/checkin" element={<InformationModal />} /> */}
          {/* <Route exact path="/checkin/message" element={<CheckinMessage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
