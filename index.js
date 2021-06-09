const express = require("express");

const app = express();

app.use(express.json());

require("./db/mysql");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type,Accept,x-auth-token"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

const ambulanceRouter = require("./routes/ambulance");
const doctorRouter = require("./routes/doctor");
const wardRouter = require("./routes/ward");
const nurseRouter = require("./routes/nurse");
const patientRouter = require("./routes/patient");

app.use("/ambulance", ambulanceRouter);
app.use("/doctor", doctorRouter);
app.use("/ward", wardRouter);
app.use("/nurse", nurseRouter);
app.use("/patient", patientRouter);

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log("server running on port ", port);
});
