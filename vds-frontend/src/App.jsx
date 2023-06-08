import React from "react";
//import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Dashboard from "./containers/dashboard/Dashboard";
import Settings from "./containers/settings/Settings";
import InformationModal from "./components/informationModal/InformationModal";
import CheckinMessage from "./components/informationModal/CheckinMessage";

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Dashboard></Dashboard>} />
          <Route exact path="/dashboard" element={<Dashboard></Dashboard>} />
          <Route
            exact
            path="dashboard/settings"
            element={<Settings></Settings>}
          />
          <Route exact path="/checkin" element={<InformationModal/>} />
          <Route exact path="/checkin/message" element={<CheckinMessage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
