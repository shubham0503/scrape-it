const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to coupon scrapper APIs" });
});

require("./app/routes/coupons.js")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
