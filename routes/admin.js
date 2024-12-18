const express = require("express");
const routes = express.Router();

const {
  addStudents,
  deleteStudents,
  addCourses,
  addteachers,
  deleteTeachers,
  deleteCourses,
  createClass,
  getCourses,
  getTeachers,
  getStudents,
  getStudentsByClass,
} = require("../controllers/admin");
routes.post("/addstudent", addStudents);
routes.get("/getstudent", getStudents);
routes.get("/getstudentbyclass", getStudentsByClass);
routes.post("/addteacher", addteachers);
routes.get("/getteacher", getTeachers);
routes.post("/addcourse", addCourses);
routes.get("/getcourse", getCourses);
routes.post("/createclass", createClass);
routes.delete("/deletecourse", deleteCourses);
routes.delete("/deletestudent", deleteStudents);
routes.delete("/deleteteacher", deleteTeachers);

module.exports = routes;
