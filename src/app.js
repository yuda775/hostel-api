const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const roomFacilitesRoutes = require("./routes/roomFacilitiesRoutes");
const roomRoutes = require("./routes/roomRoutes");

// Routes
app.use("/room-facilities", roomFacilitesRoutes);
app.use("/rooms", roomRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
