const db = require("../firebaseConfig");

const viewAttendanceByTeacher = async (req, res) => {
  const { id, classId } = req.body; // `id` should be the teacher's ID
  try {
    const snapshot = await db
      .collection("attendance")
      .where("teacherId", "==", id)
      .where("classId", "==", classId) // Second condition
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No attendance records found." });
    }

    // Extract documents from the query snapshot
    const attendanceRecords = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID if needed
      ...doc.data(), // Spread the document data
    }));

    return res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const showClass = async (req, res) => {
  const { id } = req.query; // Extract teacherId from the request parameters

  try {
    // Reference to the classes collection in Firestore
    const classesRef = db.collection("classes");

    // Query to find classes where teacherId matches the provided id
    const snapshot = await classesRef.where("teacherId", "==", id).get();

    if (snapshot.empty) {
      // No classes found for this teacher
      return res
        .status(404)
        .json({ message: "No classes found for this teacher." });
    }

    // Map the snapshot to an array of classes and fetch course name for each class
    const classes = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const classData = doc.data();
        const courseId = classData.courseId;

        // Fetch the course name for each class using the courseId
        const courseRef = db.collection("courses").doc(courseId);
        const courseDoc = await courseRef.get();

        // If the course doesn't exist, skip it or handle the error as needed
        if (!courseDoc.exists) {
          console.log(`Course not found for ID: ${courseId}`);
        }

        const courseName = courseDoc.exists ? courseDoc.data().name : "Unknown";

        // Return the class data with courseName added
        return {
          id: doc.id,
          courseName: courseName, // Add courseName to the response
          ...classData,
        };
      })
    );

    // Return the list of classes with course names
    return res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not retrieve classes." });
  }
};

const markAttendace = async (req, res) => {
  const { classId, teacherId, attendance } = req.body;
  const dateId = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  try {
    await db
      .collection("attendance")
      .doc(dateId)
      .set({ classId, teacherId, attendance });
    return res.status(200).json({ msg: "document created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "some error occured" });
  }
};

const getCourseName = async () => {
  const { id } = req.query;
  try {
    // Reference to the courses collection in Firestore
    const courseRef = db.collection("courses").doc(id);

    // Fetch the document from Firestore
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
    }

    // Return the courseName from the document data
    return doc.data().courseName;
  } catch (error) {
    console.error("Error fetching course name:", error);
    throw new Error("Error fetching course name");
  }
};

const teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Reference to the teachers collection
    const teachersRef = db.collection("teachers");

    // Query to check if the email exists
    const snapshot = await teachersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      // Email does not exist
      return res.status(404).json({ message: "Email does not exist" });
    }

    // Get the teacher's document data and ID
    let teacherDoc = null;
    let teacherId = null;
    snapshot.forEach((doc) => {
      teacherDoc = doc.data();
      teacherId = doc.id; // Extract document ID
    });

    // Check if the password matches
    if (teacherDoc.password !== password) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // User exists, password is correct, return teacherId as well
    return res.status(200).json({
      success: true,
      message: "Login successful",
      teacherId: teacherId, // Include teacherId
    });
  } catch (error) {
    console.error("Error during teacher login:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not process login" });
  }
};

module.exports = {
  viewAttendanceByTeacher,
  markAttendace,
  showClass,
  getCourseName,
  teacherLogin,
};
