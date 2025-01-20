const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'views'))) // Serve static HTML files from "views"
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve images from "uploads" folder

// Routes
const emailRoutes = require("./routes/emailRoutes");
app.use("/api/email", emailRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
