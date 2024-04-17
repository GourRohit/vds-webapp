const express = require("express");
const cors = require("cors");

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/Application", async (req, res) => {
  try {
    const requestData = req.data;
    console.log("This is the request data that I got: ", requestData)

    const responseData = {
      "successful": true,
      "errors": [
        {
          "code": "",
          "message": ""
        }
      ],
      "confirmationID": "",
      "webServiceID": "",
      "webServiceStart": "",
      "webServiceEnd": ""
    }

    if(!requestData){
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  process.exit(0);
});