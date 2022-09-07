const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const geolib = require("geolib");
const userRoute = require("./routes/users");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/posts");
const doctorRoute = require("./routes/doctors");
const verificationRoute = require("./routes/verificationRoutes");
const OperationModel = require("./models/OperationModel");
const userC_LoginCheck = require("./middleware/userC_LoginCheck");
const userB_LoginCheck = require("./middleware/userB_LoginCheck");

let activeUsers = {};
let activeEmergencyDoctors = [
  {
    socketId: "iBqrxmP19h9DABIkAAB-",
    userId: "6309eacdba459c3d6ec55e7e",
    charge: 450,
    location: {
      altitude: -40.099998474121094,
      heading: 0,
      altitudeAccuracy: 1.4855982065200806,
      latitude: 23.1346628,
      speed: 0,
      longitude: 90.2694133,
      accuracy: 32.7531299835332,
    },
  },
  {
    socketId: "iBqrxmP19h9DABIkAAC-",
    userId: "6309eacdba459c3d6ec55e8e",
    charge: 600,
    location: {
      altitude: -40.089998474121094,
      heading: 0,
      altitudeAccuracy: 1.4855982065200806,
      latitude: 23.8345533,
      speed: 0,
      longitude: 90.3694226,
      accuracy: 32.7599983215332,
    },
  },
  {
    socketId: "iBqrxmP19h9DABIkACB-",
    userId: "6309eacdba459c3d6ec55e1e",
    charge: 955,
    location: {
      altitude: -40.089998474121094,
      heading: 0,
      altitudeAccuracy: 1.4855982065200806,
      latitude: 23.9346628,
      speed: 0,
      longitude: 90.3694133,
      accuracy: 32.7599983215332,
    },
  },
];

const addEmergencyDoctor = (data) => {
  const ukil = activeEmergencyDoctors.find(
    (ukil) => ukil.userId === data.userId
  );
  if (ukil) {
    console.log("Ukil is Already in Emergency Doctor List");
    ukil.socketId = data.socketId;
    ukil.location = data.location;
    ukil.charge = data.charge;
    console.log("Ukil charge,location socketId is Updated");
  } else {
    activeEmergencyDoctors.push(data);
    console.log("Ukil is Added in Emergency Doctor List");
  }
  console.log("An Ukil is Connected");
  // console.log("_________________refresh data after connection________________");
  // console.log(activeEmergencyDoctors);
};

const removeUser = (socketId) => {
  activeEmergencyDoctors = activeEmergencyDoctors.filter(
    (user) => user.socketId !== socketId
  );
  console.log("An Ukil is Disconnected");
  // console.log(
  //   "_________________refresh data after disconnenct________________"
  // );
  // console.log(activeEmergencyDoctors);
};

// get user location
const getDistanceFromUser = (clientLocation, ukilLocation) => {
  const d = geolib.getDistance(
    { latitude: clientLocation.latitude, longitude: clientLocation.longitude },
    { latitude: ukilLocation.latitude, longitude: ukilLocation.longitude }
  );
  console.log("distance", d / 1000, "KM");
  return d / 1000;
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
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(morgan("common"));
app.set("io", io);
// routes
app.use("/api/users", userRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/otp", verificationRoute);
app.post("/api/emergency", userC_LoginCheck, async (req, res) => {
  console.log(req.body);
  try {
    //make an event to call all active doctors
    var socket = req.app.get("io");
    //calculating distance
    let nearUkils = [];
    activeEmergencyDoctors.map((doctor) => {
      doctor.distance = getDistanceFromUser(req.body.location, doctor.location);
      doctor.status = "reachable";
      // selecting the accepted range ukils
      if (doctor.distance < process.env.ACCEPTED_DISTANCE) {
        nearUkils.push(doctor);
      }
    });

    if (nearUkils.length == 0) {
      console.log("no ukil found");
      return res.status(200).json("No Ukil Avaiable Near You, Try Later");
    }
    // sorting the ukils lower to higher cost
    nearUkils.sort((a, b) => {
      return a.charge - b.charge;
    });

    const totalCost = nearUkils.reduce(
      (total, ukil) => total + parseInt(ukil.charge),
      0
    );
    const avgCost = Math.floor(totalCost / nearUkils.length);
    console.log(nearUkils);
    console.log(
      `${nearUkils.length} ukil found nearby with average charge ${avgCost}`
    );
    const newOperation = new OperationModel({
      clientId: req.user._id,
      clientLocation: req.body.location,
      avialableUkils: nearUkils,
      averageCost: avgCost,
      operationStatus: "active",
    });
    const operation = await newOperation.save();

    const senderUkilUserId = operation.avialableUkils[0].userId;
    // check if the doctor is online
    if (
      activeEmergencyDoctors.some((ukil) => ukil.userId === senderUkilUserId)
    ) {
      const ukilSocketId = activeUsers[senderUkilUserId];
      const updatedData = await OperationModel.findOneAndUpdate(
        {
          _id: operation._id,
          "avialableUkils.userId": senderUkilUserId,
        },
        {
          $set: {
            "avialableUkils.$.status": "call sent",
          },
        }
      );
      socket.to(ukilSocketId).emit("emergencyDoctorCall", {
        operationId: operation._id,
        charge: avgCost,
      });
      console.log("New Operation Activated :", operation._id);
    } else {
      console.log("Ukil went offline...");
      const updatedData = await OperationModel.findOneAndUpdate(
        {
          _id: operation._id,
          "avialableUkils.userId": senderUkilUserId,
        },
        {
          $set: {
            "avialableUkils.$.status": "went offline",
          },
        }
      );

      // call function for next user
      return await getReachableUkil(operation._id, res, req);
    }

    // event for all
    // socket.emit("emergencyDoctorCall");

    // send the filterd doctors details to patients
    res.header("Access-Control-Allow-Origin");
    return res.status(200).json("Searching Nearby Ukils for You, Sir");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
app.put("/api/emergency", userB_LoginCheck, async (req, res) => {
  console.log(req.body);
  try {
    const updateData = await OperationModel.findOneAndUpdate(
      {
        _id: req.body.operationId,
        "avialableUkils.userId": req.user._id,
      },
      {
        $set: {
          "avialableUkils.$.status": req.body.reason,
        },
      }
    );

    return await getReachableUkil(req.body.operationId, res, req);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
app.put("/api/accept/emergency", userB_LoginCheck, async (req, res) => {
  try {
    const updateData = await OperationModel.findOneAndUpdate(
      {
        _id: req.body.operationId,
      },
      {
        $set: {
          ukil: req.user._id,
          ukilLocation: req.body.location,
          operationStatus: "payment pending",
        },
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json("Please Wait for the payemnt process. Our Admin will call you");
  } catch (error) {
    console.log(error);
  }
});
const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const getReachableUkil = async (operationId, res, req) => {
  try {
    var socket = req.app.get("io");
    // getting the reachable user
    const reachableUkil = await OperationModel.findOne(
      {
        _id: operationId,
        operationStatus: "active",
        "avialableUkils.status": "reachable",
      },
      {
        _id: 0,
        averageCost: 1,
        "avialableUkils.$": 1,
      }
    );
    if (reachableUkil) {
      // ukil user id
      const ukilUserId = reachableUkil.avialableUkils[0].userId;
      // check if the doctor is online
      if (activeEmergencyDoctors.some((ukil) => ukil.userId === ukilUserId)) {
        const ukilSocketId = activeUsers[ukilUserId];
        const updateData = await OperationModel.findOneAndUpdate(
          {
            _id: operationId,
            "avialableUkils.userId": ukilUserId,
          },
          {
            $set: {
              "avialableUkils.$.status": "call sent",
            },
          }
        );
        console.log("call sent to next ukil");
        socket.to(ukilSocketId).emit("emergencyDoctorCall", {
          operationId,
          charge: reachableUkil.averageCost,
        });
        return res.status(200).json("Call Forwarded to Next Ukil");
      } else {
        console.log("ukil went offline...");
        const updateData = await OperationModel.findOneAndUpdate(
          {
            _id: operationId,
            "avialableUkils.userId": ukilUserId,
          },
          {
            $set: {
              "avialableUkils.$.status": "went offline",
            },
          }
        );
        console.log("searching again...");
        return await getReachableUkil(operationId, res, req);
      }
    } else {
      console.log("no ukil available");
      // update the status of the operation to close
      const updateData = await OperationModel.findOneAndUpdate(
        {
          _id: operationId,
        },
        {
          $set: {
            operationStatus: "close",
          },
        }
      );
      // find the client and emit an event
      return res.status(200).json("Call Forwarded to Next Ukil");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// socket
io.on("connection", (socket) => {
  socket.on("MapUserId", (userId) => {
    activeUsers[userId] = socket.id;
    console.log(activeUsers);
  });
  socket.on("EmergencyDoctorAvaliable", (data) => {
    addEmergencyDoctor(data);
    console.log("emergency doctor added...");
    // console.log(data);
  });

  socket.on("emergencyCallDisconnect", () => {
    console.log("user didnot recieve the call");
  });

  socket.on("receiveEmergencyCall", (userB) => {
    stop = true;
    console.log(`Call received by ${userB.user.fullName}`);
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
