const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const doctorRoute = require("./routes/doctors");
const verificationRoute = require("./routes/verificationRoutes");

let activeDoctors = [];
const addNewUser = (socketId) => {
  activeDoctors.push(socketId);
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
  //make an event to call all active doctors
  var socket = req.app.get("io");
  socket.emit("emergencyDoctorCall", "world");
  res.header("Access-Control-Allow-Origin");
  res.send("ok...");
});
// socket
io.on("connection", (socket) => {
  addNewUser(socket.id);
  console.log("client connected: ", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});
// app listenning ...
httpServer.listen(5000, () => {
  console.log("backend server is running on port 5000");
});
