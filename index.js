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
const tokenRoute = require("./routes/tokenRoutes");
const operationRoutes = require("./routes/operationRoutes");
const verificationRoute = require("./routes/verificationRoutes");
const OperationModel = require("./models/OperationModel");
const userC_LoginCheck = require("./middleware/userC_LoginCheck");
const userB_LoginCheck = require("./middleware/userB_LoginCheck");
const ExpoPushTokenModel = require("./models/ExpoPushToken");
const { GenerateRegerenceCode } = require("./config/ReferenceCode");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
let activeUsers = {};
let activeEmergencyDoctors = [
  // {
  //   socketId: "iBqrxmP19h9DABIkAAB-",
  //   userId: "6309eacdba459c3d6ec55e7e",
  //   charge: 450,
  //   location: {
  //     altitude: -40.099998474121094,
  //     heading: 0,
  //     altitudeAccuracy: 1.4855982065200806,
  //     latitude: 23.1346628,
  //     speed: 0,
  //     longitude: 90.2694133,
  //     accuracy: 32.7531299835332,
  //   },
  // },
  // {
  //   socketId: "iBqrxmP19h9DABIkAAC-",
  //   userId: "6309eacdba459c3d6ec55e8e",
  //   charge: 600,
  //   location: {
  //     altitude: -40.089998474121094,
  //     heading: 0,
  //     altitudeAccuracy: 1.4855982065200806,
  //     latitude: 23.8345533,
  //     speed: 0,
  //     longitude: 90.3694226,
  //     accuracy: 32.7599983215332,
  //   },
  // },
  // {
  //   socketId: "iBqrxmP19h9DABIkACB-",
  //   userId: "6309eacdba459c3d6ec55e1e",
  //   charge: 955,
  //   location: {
  //     altitude: -40.089998474121094,
  //     heading: 0,
  //     altitudeAccuracy: 1.4855982065200806,
  //     latitude: 23.9346628,
  //     speed: 0,
  //     longitude: 90.3694133,
  //     accuracy: 32.7599983215332,
  //   },
  // },
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
const sendExpoPushNotification = async (userId, msg) => {
  const data = await ExpoPushTokenModel.findOne({ userId });
  const expoPushToken = data.expoPushToken;
  sendPushNotification(expoPushToken, msg);
};

async function sendPushNotification(expoPushToken, msg) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "UkilBabu",
    body: msg,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

// main app initialization
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
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
app.use("/api/token", tokenRoute);
app.use("/api/otp", verificationRoute);
app.use("/api/operation", operationRoutes);
app.post("/api/emergency", userC_LoginCheck, async (req, res) => {
  try {
    //make an event to call all active doctors
    var socket = req.app.get("io");
    //calculating distance
    let nearUkils = [];
    activeEmergencyDoctors.map((doctor) => {
      doctor.distance = getDistanceFromUser(req.body.location, doctor.location);
      doctor.status = "reachable";
      // selecting the accepted range ukils
      if (!doctor.distance < process.env.ACCEPTED_DISTANCE) {
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
    console.log(
      `${nearUkils.length} ukil found nearby with average charge ${avgCost}`
    );
    // generate bkash ref
    const refCode = GenerateRegerenceCode();
    // save to operation table
    const newOperation = new OperationModel({
      clientId: req.user._id,
      clientLocation: req.body.location,
      availableUkils: nearUkils,
      averageCost: avgCost,
      referenceCode: refCode,
      operationStatus: "active",
    });
    const operation = await newOperation.save();

    const senderUkilUserId = operation.availableUkils[0].userId;
    // check if the doctor is online
    if (
      activeEmergencyDoctors.some((ukil) => ukil.userId === senderUkilUserId)
    ) {
      sendExpoPushNotification(senderUkilUserId, "YOU HAVE AN EMERGENCY CALL");
      const ukilSocketId = activeUsers[senderUkilUserId];
      const updatedData = await OperationModel.findOneAndUpdate(
        {
          _id: operation._id,
          "availableUkils.userId": senderUkilUserId,
        },
        {
          $set: {
            "availableUkils.$.status": "call sent",
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
          "availableUkils.userId": senderUkilUserId,
        },
        {
          $set: {
            "availableUkils.$.status": "went offline",
          },
        }
      );

      // call function for next user
      return await getReachableUkil(operation._id, res, req);
    }
    res.header("Access-Control-Allow-Origin");
    return res
      .status(200)
      .json({ msg: "Searching Nearby Ukils for You, Sir", _id: operation._id });
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
        "availableUkils.userId": req.user._id,
      },
      {
        $set: {
          "availableUkils.$.status": req.body.reason,
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
  var socket = req.app.get("io");
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
    // generate an ref id
    // emit event to the client
    socket.to(activeUsers[updateData.clientId]).emit("ClientPayment");
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
        "availableUkils.status": "reachable",
      },
      {
        _id: 0,
        averageCost: 1,
        "availableUkils.$": 1,
      }
    );
    if (reachableUkil) {
      // ukil user id
      const ukilUserId = reachableUkil.availableUkils[0].userId;
      // check if the doctor is online
      if (activeEmergencyDoctors.some((ukil) => ukil.userId === ukilUserId)) {
        const ukilSocketId = activeUsers[ukilUserId];
        sendExpoPushNotification(ukilUserId, "YOU HAVE AN EMERGENCY CALL");
        const updateData = await OperationModel.findOneAndUpdate(
          {
            _id: operationId,
            "availableUkils.userId": ukilUserId,
          },
          {
            $set: {
              "availableUkils.$.status": "call sent",
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
            "availableUkils.userId": ukilUserId,
          },
          {
            $set: {
              "availableUkils.$.status": "went offline",
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
  socket.on("online", () => {
    console.log("app online");
  });
  socket.on("MapUserId", (userId) => {
    activeUsers[userId] = socket.id;
    console.log(activeUsers);
  });
  socket.on("EmergencyDoctorAvaliable", (data) => {
    addEmergencyDoctor(data);
    socket.emit("operation-doctorLocations", activeEmergencyDoctors);
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
