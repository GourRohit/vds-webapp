const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

/*****Database ******/
const sqlite3 = require("sqlite3").verbose();
//const db = new sqlite3.Database(":memory:");

// serve up production assets
app.use(express.static("../vds-frontend/build"));

let db = new sqlite3.Database("./vds.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err && err.code == "SQLITE_CANTOPEN") {
    createDatabase();
    return;
  } else if (err) {
    console.log("Getting error " + err);
    exit(1);
  }
});

function createDatabase() {
  db = new sqlite3.Database("./vds.db", (err) => {
    if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    createTables();
  });
}

const createTables = () => {
  db.serialize(() => {
    db.run("CREATE TABLE CHECKIN_DATA (documentNumber TEXT, appointmentTime TEXT)");
    console.log("sucessfully create table");
  });
};

function insertData(data) {
  return new Promise(function (resolve, reject) {
    return db.run(
      `INSERT INTO CHECKIN_DATA(documentNumber, appointmentTime) VALUES(?,?)`,
      [data.documentNumber, data.appointmentTime ],
      function (error) {
        if (error) {
          return reject(error);
        } else {
          return resolve("success");
        }
      }
    );
  });
}

function checkForDuplicateData(docNumber) {
  return new Promise(function (resolve, reject) {
    var query =
      "SELECT documentNumber, appointmentTime FROM CHECKIN_DATA  WHERE documentNumber = " +
      "'" +
      docNumber +
      "'";
    return db.all(query, function (error, rows) {
      if (error) {
        return reject(error);
      } else {
        if (rows.length > 0) {
          return resolve(rows);
        } else {
          return resolve(false);
        }
      }
    });
  });
}

app.post("/data", async (req, res) => {
  let message, appointmentTime;
  const data = {
    documentNumber: req.body.documentNumber,
    appointmentTime: req.body.currentTime
  };
  let rows = await checkForDuplicateData(data.documentNumber);
  if (!rows.length > 0) {
    message = await insertData(data);
  } else {
    message = "duplicate";
    appointmentTime = rows[0].appointmentTime
  }
  res.json({ message: message, appointmentTime: appointmentTime });
});
function getdataFromDb() {
  return new Promise(function (resolve, reject) {
    return db.all("SELECT documentNumber FROM CHECKIN_DATA", (error, rows) => {
      return resolve(rows);
    });
  });
}
app.get("/data", async (req, res) => {
  let identitydata = [];
  const data = await getdataFromDb();
  data.forEach((row) => {
    identitydata.push(row.documentNumber);
  });
  res.json({ data: identitydata });
});

app.delete("/data", async (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM CHECKIN_DATA");
    res.json({ message: "Successfully deleted checkin data" });
  });
});

app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../vds-frontend", "build", "index.html")
  );
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing DB");
  db.close();
  process.exit(0);
});
