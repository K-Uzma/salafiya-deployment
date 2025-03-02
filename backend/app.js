require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AdminRouter = require("./routes/adminRouter");
const app = express();

const PORT = process.env.PORT || 3000;

require("./db");
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());

app.use(AdminRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
