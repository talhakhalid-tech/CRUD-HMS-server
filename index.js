const express = require("express");

const app = express();

app.use(express.json());

require("./db/mysql");

const ambulanceRouter = require("./routes/ambulance");
const doctorRouter = require("./routes/doctor");
const wardRouter = require("./routes/ward");

app.use("/ambulance", ambulanceRouter);
app.use("/doctor", doctorRouter);
app.use("/ward", wardRouter);

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log("server running on port ", port);
});
