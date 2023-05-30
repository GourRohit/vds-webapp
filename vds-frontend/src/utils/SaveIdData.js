import axios from "axios";
import moment from "moment";
import { API_URL } from "../UrlConfig";

export function saveIdData(data) {
  console.log("In Save ID Data method")
  let message = "";
  let time = moment().add(30, "m").format("LT");
  const idData = {
    documentNumber: data.data.documentNumber,
    currentTime: time
  };
  axios
    .post(`${API_URL}/data`, idData)
    .then((res) => {
      if (res.data && res.status) {
        if (res.data.message === "success") {
          message = ` Welcome ${data.givenNames} ${data.familyName}, you are checked in for 
            your ${data.time} appointment.`;
            console.log("MESSAGE FROM SAVE_ID_DATA", message)
          return message;
        } else if (res.data.message === "duplicate") {
          message = ` Welcome ${data.givenNames} ${data.familyName}, we
              could find that you are already checked in. ${res.data.appointmentTime}`;
          return message;
        } else {
          return message;
        }
      }
    })
    .catch((err) => {
      message = `Failed to checkin. Error received: ${err}`;
      return message;
      // console.error("error response", err);
      // return "failed";
    });
}
