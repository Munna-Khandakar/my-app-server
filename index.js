const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/posts");
const doctorRoute = require("./routes/doctors");
const verificationRoute = require("./routes/verificationRoutes");

let activeDoctors = [];
let activeEmergencyDoctors = [];
const addNewUser = (socketId) => {
  activeDoctors.push(socketId);
};

const addEmergencyDoctor = (data) => {
  activeEmergencyDoctors.push(data);
};

const removeUser = (socketId) => {
  activeDoctors = activeDoctors.filter((user) => user.socketId !== socketId);
  activeEmergencyDoctors = activeEmergencyDoctors.filter(
    (user) => user.socketId !== socketId
  );
};

const getUser = (username) => {
  // return onlineUsers.find((user) => user.username === username);
};

// main app initialization
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
dotenv.config();

// mongodb connection
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB connected...");
  }
);

//serve our code

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.set("io", io);
// routes
app.use("/api/users", userRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/otp", verificationRoute);
app.get("/api/emergency", (req, res) => {
  try {
    //make an event to call all active doctors
    var socket = req.app.get("io");
    // event for the doctors call
    // filter the doctors, emit the event to the specific doctors
    socket.emit("emergencyDoctorCall");

    // send the filterd doctors details to patients
    res.header("Access-Control-Allow-Origin");
    return res.status(200).json({ doctors: activeEmergencyDoctors });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// socket
io.on("connection", (socket) => {
  socket.on("EmergencyDoctorAvaliable", (data) => {
    addEmergencyDoctor(data);
    console.log("emergency doctor added...");
    console.log(data);
  });

  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
    console.log(reason);
  });
});
// app listenning ...
httpServer.listen(5000, () => {
  console.log("backend server is running on port 5000");
});
