import axios from "axios";
import moment from "moment";
import { VDS_URL, BASE_URL } from "../UrlConfig";

export function getDeviceStatus() {
  return axios.get(`${VDS_URL}/reader/connection/status`);
}

export function saveIdData(data) {
  let time = moment().add(30, "m").format("LT");
  const idData = {
    documentNumber: data.documentNumber,
    currentTime: time,
    portrait: data.portrait,
  };
  return axios.post(`${BASE_URL}/data`, idData);
}

export function getIdentityInfo() {
  return axios.get(`${VDS_URL}/identity/info`);
}

export function getReaderinfo() {
  return axios.get(`${VDS_URL}/reader/info`);
}

export function clearData() {
  return axios.delete(`${BASE_URL}/data`);
}

export function setReaderProperties(value) {
  return axios.post(`${VDS_URL}/reader/properties`, {
    setting: "USB_mode",
    value: {
      mode: value,
    },
  });
}
