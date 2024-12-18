"use client";
import React, { useEffect, useState } from "react";
import AddStudent from "./_components/AddStudent";
import GlobalApi from "@/app/services/GlobalApi";
import StudentList from "./_components/StudentList";

function Student() {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    getStudentList();
  }, []);

  const getStudentList = () => {
    GlobalApi.getAllStudent().then((resp) => {
      setStudentList(resp.data);
    });
  };
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        Students
        <AddStudent refreshData={getStudentList} />
      </h2>
      <StudentList studentList={studentList} refreshData={getStudentList} />
    </div>
  );
}

export default Student;
