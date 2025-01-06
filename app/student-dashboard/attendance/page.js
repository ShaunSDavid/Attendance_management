"use client";
import MonthSelection from "@/app/_components/MonthSelection";
import YearSelection from "@/app/_components/YearSelection";
import GlobalApi from "@/app/services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AttendanceGrid from "./_components/AttendanceGrid";
import jwtDecode from "jwt-decode";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [attendanceList, setAttendanceList] = useState([]);
  const [email, setEmail] = useState("");
  // Logic for gettting data for a specified month and year

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.error("Auth token not found.");
    }
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setSelectedYear("2021-2025");
    }
  }, []);

  useEffect(() => {
    if (selectedYear) {
      searchHandler();
    }
  }, [selectedYear]);

  const searchHandler = () => {
    const month = moment(selectedMonth).format("MM/YYYY");
    GlobalApi.getStudentAttendanceList(selectedYear, month, email).then(
      (resp) => {
        setAttendanceList(resp.data);
      }
    );
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-bold">Attendance</h2>
      <br></br>
      <div className="flex gap-4 border p-5 rounded-lg shadow-sm">
        <div className="flex gap-2 items-center">
          <label>Select Month:</label>
          <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
        </div>
        <div className="flex gap-2 items-center">
          <label>Select Year:</label>
          <YearSelection selectedYear={(v) => setSelectedYear(v)} />
        </div>
        <Button onClick={() => searchHandler()}>Search</Button>
      </div>
      {/* Sending the data */}
      <AttendanceGrid
        attendanceList={attendanceList}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
}

export default Attendance;
