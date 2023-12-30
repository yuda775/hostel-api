const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const roomFacilitesRoutes = require("./routes/roomFacilitiesRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// Routes
app.use("/room-facilities", roomFacilitesRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
