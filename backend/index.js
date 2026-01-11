const express = require("express");
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

const initApp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

initApp();
