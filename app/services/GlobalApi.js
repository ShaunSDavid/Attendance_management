const { default: axios } = require("axios");
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const axiosInstance = axios.create({ baseURL: BASE_URL });

//Student
const getAllYears = () => axiosInstance.get("/api/year");
const createStudent = (data) => axiosInstance.post("/api/students", data);
const getAllStudent = () => axiosInstance.get("/api/students");
const deleteStudent = (id) => axiosInstance.delete("/api/students?id=" + id);

//Attendance
const getAttendanceList = (year, month) =>
  axiosInstance.get("/api/attendance?year=" + year + "&month=" + month);

//Attendance for a Student
const getStudentAttendanceList = (year, month, email) =>
  axiosInstance.get(
    "/api/attendance?year=" + year + "&month=" + month + "&email=" + email
  );

const markAttendance = (data) => axiosInstance.post("/api/attendance", data);

const deleteAttendanceRecord = ({ Rollno, date, day }) =>
  axiosInstance.delete("/api/attendance", {
    params: { Rollno, date, day },
  });

//Login & Roles
const getUserRole = async (email, password) => {
  try {
    const response = await axiosInstance.get("/api/login", {
      params: { email, password },
    });
    if (response.data.role) {
      return response.data.role;
    } else {
      console.error("No role found.");
      return null;
    }
  } catch (error) {
    console.error("Error in getUserRole API call:", error);
    throw error;
  }
};

export default {
  getAllYears,
  createStudent,
  getAllStudent,
  deleteStudent,
  getAttendanceList,
  getStudentAttendanceList,
  markAttendance,
  deleteAttendanceRecord,
  getUserRole,
};
