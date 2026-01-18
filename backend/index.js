const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true, // allow credentials seperti cookie, authorization header, dsb
};
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes
const authRoute = require("./routes/authRoute");
app.use("/api/auth", authRoute);

const pollRoute = require("./routes/pollRoute");
app.use("/api/poll", pollRoute);

const userRoute = require("./routes/userRoute");
app.use("/api/user", userRoute);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"], // Harus sama dengan CORS Express Anda
    credentials: true,
  },
});

// Logic Socket.io (Bisa ditaruh di file terpisah agar rapi)
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join_poll", (pollId) => {
    socket.join(pollId);
    console.log(`User joined poll: ${pollId}`);
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

// EXPORT 'io' agar bisa dipakai di Routes/Controllers Anda
// (Sangat penting untuk mengirim update saat ada vote baru)
app.set("socketio", io);

const initApp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    httpServer.listen(port, () =>
      console.log(`Server (HTTP + Socket.io) listening on port ${port}!`)
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

initApp();
