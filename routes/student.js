const express = require("express");
const {
  viewAttendanceByStudent,
  studentLogin,
  showClassForStudent,
} = require("../controllers/student");
const routes = express.Router();

routes.post("/viewattendance", viewAttendanceByStudent);
routes.get("/showclass", showClassForStudent);
routes.post("/login", studentLogin);

module.exports = routes;
