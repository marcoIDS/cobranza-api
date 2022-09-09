const config = require("config");
const mongoose = require("mongoose");
const usersRoute = require("./routes/users.route");
const prestamosRoute = require("./routes/prestamos.route");
const abonosRoute = require("./routes/abonos.route");



const express = require("express");
const cors = require('cors');
const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: "Content-Type, x-auth-token",
  exposedHeaders: "Content-Type, x-auth-token",
}
app.use(cors(corsOptions));

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

let dev = "mongodb://127.0.0.1:27017/cobranza?authSource=admin";
mongoose
  .connect(dev, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((resp) => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err, "Could not connect to MongoDB..."));

app.use(express.json());
//use users route for api/users
app.use("/users", usersRoute);
app.use("/prestamos", prestamosRoute);
app.use("/abonos", abonosRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));