const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


const app = express();
const userRoutes = require('./routes/User');
const conversationRoutes = require('./routes/Conversation');
const messageRoutes = require('./routes/Message');

const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

mongoose.connect(MONGO_URI);
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});


app.use('/user', userRoutes);
app.use('/conversation', conversationRoutes); 
app.use('/message', messageRoutes);
app.use((req, res, next) => {
  res.status(200).json({ message: "app is running" });
});

module.exports = app;
