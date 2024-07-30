if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.DB_URL;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(bodyParser.json());

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const alertSchema = new mongoose.Schema({
  flightNumber: String,
  user_email: String,
  user_name: String,
  departure: String,
  arrival: String,
});

const Alert = mongoose.model("Alert", alertSchema);

app.get("/", (req, res) => {
  res.send("Hello From Server, and MongoDB is connected");
});

app.post("/saveAlert", (req, res) => {
  console.log("Received request:", req.body);
  const { flightNumber, user_email, user_name, departure, arrival,status } = req.body;
  const alert = new Alert({
    flightNumber,
    user_email,
    user_name,
    departure,
    arrival,
    status,
  });

  alert
    .save()
    .then(() => {
      console.log("Alert saved successfully");
      res.status(200).send("Alert saved successfully");
    })
    .catch((error) => {
      console.error("Error saving alert:", error);
      res.status(500).send("Error saving alert: " + error);
    });
});

app.get("/alerts", async (req, res) => {
  try {
   const alerts= await Alert.find({});
  //  console.log(alerts);
   res.send(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).send("Error fetching alerts");
  }
});








app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
