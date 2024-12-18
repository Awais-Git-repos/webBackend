const db = require("../firebaseConfig");

const viewAttendanceByStudent = async (req, res) => {
  const { classId, studentId } = req.body; // `classId` is the class ID, `studentId` is the student's ID

  try {
    const snapshot = await db
      .collection("attendance")
      .where("classId", "==", classId)
      .get();

    if (snapshot.empty) {
      return res
        .status(200)
        .json({ message: "No attendance records found for this class." });
    }

    // Extract and filter records for the given student ID
    const studentAttendance = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        // Filter attendance array for the student's ID
        const filteredAttendance = data.attendance.filter(
          (record) => record.sid === studentId
        );
        return filteredAttendance.length > 0
          ? {
              id: doc.id, // Include document ID if needed
              classId: data.classId,
              teacherId: data.teacherId,
              date: doc.id, // Assuming doc.id is the date
              attendance: filteredAttendance,
            }
          : null; // Return null for records without the student's attendance
      })
      .filter((record) => record !== null); // Remove null entries

    if (studentAttendance.length === 0) {
      return res
        .status(200)
        .json({ message: "No attendance records found for this student." });
    }

    return res.status(200).json(studentAttendance);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Reference to the teachers collection
    const teachersRef = db.collection("students");

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
      studentId: teacherId, // Include teacherId
    });
  } catch (error) {
    console.error("Error during teacher login:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not process login" });
  }
};

const showClassForStudent = async (req, res) => {
  const { studentId } = req.query; // Extract studentId from the request parameters
  console.log("--StudentId--", studentId);

  try {
    // Reference to the classes collection in Firestore
    const classesRef = db.collection("classes");

    // Query to find classes where studentId is in the students array
    const snapshot = await classesRef
      .where("students", "array-contains", studentId)
      .get();

    if (snapshot.empty) {
      // No classes found for this student
      return res
        .status(404)
        .json({ message: "No classes found for this student." });
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
    console.error("Error fetching classes for student:", error);
    return res.status(500).json({
      message: "Server error, could not retrieve classes for student.",
    });
  }
};

module.exports = { viewAttendanceByStudent, studentLogin, showClassForStudent };
