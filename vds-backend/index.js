const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require('axios');
const fs = require('fs');
const https = require('https')

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Creating a https agent
const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./assets/client.cer'),
  key: fs.readFileSync('./assets/client.key'),
})

// serve up production assets
app.use(express.static(path.join(__dirname, "../vds-frontend/build")));

/* Function to call GA-DDS backend API*/
async function sendDataToGADDS(apiURL, requestData) {
  try {
    // Request headers
    const requestHeaders = {
      'webServiceID': "",
      'webServiceStart': "",
      'webServiceEnd': "",
      'Content-Type': 'application/json'
    };

    // Make the POST request to GA-DDS
    const response = await axios.post(apiURL, requestData, {
      headers: requestHeaders,
      httpsAgent: httpsAgent
    });

    // Handling successful response
    return response.data;

  } catch (error) {
    // Handling error response
    console.error('Error:', error.response.data);
    throw error.response.data;
  }
}

// Handing Post request from client
app.post("/application", async (req, res) => {

  try {
    //Sending the Data to the GA-DDS Backend
    const URL = "https://ws-staging.drives.ga.gov/WebServices/CC/GST/Driver/IdApplication/Application";

    const responseData = await sendDataToGADDS(URL, req.body);
    console.log("we got response: ", responseData); 

    // Check if responseData is undefined or not
    if (!responseData) {
      return res.status(400).json({ error: 'Bad Request - Missing required properties' });
    }

    // Return the fetched data as JSON
    res.status(200).json(responseData)

  } catch (error) {
    // Handling any error
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../vds-frontend", "build", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  process.exit(0);
});

