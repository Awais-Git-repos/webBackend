const express = require("express");
const {
  markAttendace,
  viewAttendanceByTeacher,
  showClass,
  getCourseName,
  teacherLogin,
} = require("../controllers/teacher");
const routes = express.Router();

routes.post("/markattendance", markAttendace);
routes.post("/login", teacherLogin);
routes.get("/viewattendance", viewAttendanceByTeacher);
routes.get("/showclass", showClass);
routes.get("/coursename", getCourseName);

module.exports = routes;
