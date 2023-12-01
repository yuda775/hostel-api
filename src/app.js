const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload");

const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(upload());

app.use(express.static(path.join(__dirname, "../public")));

const facilitiesRoutes = require("./routes/facilitiesRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.use("/facilities", facilitiesRoutes);
app.use("/rooms", roomRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
