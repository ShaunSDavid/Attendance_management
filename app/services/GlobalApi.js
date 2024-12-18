const { default: axios } = require("axios");
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const axiosInstance = axios.create({ baseURL: BASE_URL });

//Student
const getAllYears = () => axiosInstance.get("/year");
const createStudent = (data) => axiosInstance.post("/students", data);
const getAllStudent = () => axiosInstance.get("/students");
const deleteStudent = (id) => axiosInstance.delete("/students?id=" + id);

//Attendance
const getAttendanceList = (year, month) =>
  axiosInstance.get("/attendance?year=" + year + "&month=" + month);

const markAttendance = (data) => axiosInstance.post("/attendance", data);

const deleteAttendanceRecord = ({ Rollno, date, day }) =>
  axiosInstance.delete("/attendance", {
    params: { Rollno, date, day },
  });

//Login & Roles
const getUserRole = async (email, password) => {
  try {
    const response = await axiosInstance.get("/login", {
      params: { email, password },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0].role;
    } else {
      console.error("Invalid credentials or no role found.");
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
  markAttendance,
  deleteAttendanceRecord,
  getUserRole,
};
