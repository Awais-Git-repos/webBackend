const db = require("../firebaseConfig");

// Students

const addStudents = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    db.collection("students").add({ name, email, password });
    return res.status(200).json({ msg: "student added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getStudents = async (req, res) => {
  try {
    // Fetching the students data asynchronously
    const snapshot = await db.collection("students").get();

    // Extracting student data and including the document ID
    const students = snapshot.docs.map((doc) => ({
      id: doc.id, // Adding document ID
      ...doc.data(), // Adding the document data
    }));

    // Sending the student data as a response
    return res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const addteachers = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    db.collection("teachers").add({ name, email, password });
    return res.status(200).json({ msg: "student added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getTeachers = async (req, res) => {
  try {
    // Fetching the teachers data asynchronously
    const snapshot = await db.collection("teachers").get();

    // Extracting teacher data and including the document ID
    const teachers = snapshot.docs.map((doc) => ({
      id: doc.id, // Adding document ID
      ...doc.data(), // Adding the document data
    }));

    // Sending the teacher data as a response
    return res.status(200).json({ teachers });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteStudents = async (req, res) => {
  const { id } = req.body;
  try {
    db.collection("students").doc(id).delete();
    return res.status(200).json({ msg: "document deleted successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteTeachers = async (req, res) => {
  const { id } = req.body;
  try {
    db.collection("teachers").doc(id).delete();
    return res.status(200).json({ msg: "document deleted successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Courses

const addCourses = async (req, res) => {
  const { name } = req.body;
  try {
    db.collection("courses").add({ name });
    return res.status(200).json({ msg: "course added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getCourses = async (req, res) => {
  try {
    // Fetching the courses asynchronously
    const snapshot = await db.collection("courses").get();

    // Extracting the course data and including the document ID
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id, // Adding document ID
      ...doc.data(), // Adding the document data
    }));

    // Sending the courses as a response
    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteCourses = async (req, res) => {
  const { id } = req.body;
  try {
    db.collection("courses").doc(id).delete();
    return res.status(200).json({ msg: "document deleted successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const createClass = async (req, res) => {
  const { courseId, teacherId, students } = req.body;
  try {
    await db.collection("classes").add({ courseId, teacherId, students });
    return res.status(200).json({ msg: "document created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getStudentsByClass = async (req, res) => {
  const { classId } = req.query; // Assuming the class document ID is passed as a URL parameter

  try {
    // Fetch the specific class document by its document ID
    const classDoc = await db.collection("classes").doc(classId).get();

    // Check if the document exists
    if (!classDoc.exists) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Get the data from the class document
    const classData = classDoc.data();

    // Extract the students array from the document
    const { students = [] } = classData;

    if (students.length === 0) {
      return res
        .status(200)
        .json({ students: [], message: "No students in this class." });
    }

    // Fetch all student documents using their IDs from the students array
    const studentPromises = students.map((studentId) =>
      db.collection("students").doc(studentId).get()
    );
    const studentDocs = await Promise.all(studentPromises);

    // Extract and structure the student data
    const studentData = studentDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Send the student data in the response
    return res.status(200).json({ students: studentData });
  } catch (error) {
    console.error("Error fetching students for class:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addStudents,
  deleteStudents,
  addCourses,
  deleteCourses,
  addteachers,
  deleteTeachers,
  createClass,
  getCourses,
  getTeachers,
  getStudents,
  getStudentsByClass,
};
