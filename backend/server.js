const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Added this
const userRoutes = require('./routes/user.routes')
const dbConnection = require('./db/db')

dotenv.config();
const app = express();

dbConnection()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000; // Added a fallback value for PORT

app.get("/", (req, res) => {
  res.send("The app is running...");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
