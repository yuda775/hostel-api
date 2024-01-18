const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../public")));

const roomFacilitesRoutes = require("./routes/roomFacilitiesRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/room-facilities", roomFacilitesRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
