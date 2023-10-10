import axios from "axios";
import { VDS_URL, BASE_URL } from "../UrlConfig";

export function getDeviceStatus() {
  return axios.get(`${VDS_URL}/reader/connection/status`);
}

export function saveIdData(data) {
  const idData = {
    documentNumber: data.documentNumber,
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

export function stopInfo() {
  return axios.get(`${VDS_URL}/identity/stop`)
}

export function setUsbMode(value) {
  return axios.post(`${VDS_URL}/reader/properties`, {
    setting: "USB_mode",
    value: {
      mode: value,
    },
  });
}

export function setReaderProfile(value) {
  return axios.post(`${VDS_URL}/reader/properties`, {
    setting: "Reader_Profile",
    value: {
      profile: value,
    },
  });
}
