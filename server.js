const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "Server Working...." });
});

// Admin
app.use("/api/admin", require("./routes/admin"));

// Teacher
app.use("/api/teacher", require("./routes/teacher"));

// Student
app.use("/api/student", require("./routes/student"));

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});
