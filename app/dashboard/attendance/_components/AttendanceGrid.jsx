import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useState } from "react";
import moment from "moment";
import GlobalApi from "@/app/services/GlobalApi";
import { toast } from "sonner";

function AttendanceGrid({
  attendanceList,
  selectedMonth,
  selectedYear,
  studentList,
}) {
  const [rowData, setRowData] = useState([]);
  const [colDef, setColDef] = useState([]);

  // Function to get the number of days in a given month and year
  const DaysofMonth = (year, month) => new Date(year, month, 0).getDate();
  const numberOfDays = DaysofMonth(
    moment(selectedMonth).format("yyyy"),
    moment(selectedMonth).format("MM")
  );
  const dayArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  // Function to format day with suffix (st, nd, rd, th)
  const getDayWithSuffix = (day) => {
    const j = day % 10;
    const k = day % 100;
    if (j === 1 && k !== 11) {
      return `${day}st`;
    }
    if (j === 2 && k !== 12) {
      return `${day}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${day}rd`;
    }
    return `${day}th`;
  };

  // Function to check if a day is editable (future or present date)
  const isDayEditable = (day) => {
    const today = moment();
    const cellDate = moment(selectedMonth).date(day);
    return cellDate.isSameOrAfter(today, "day");
  };

  useEffect(() => {
    if (attendanceList) {
      const filteredList = attendanceList.filter(
        (record) => record.year === selectedYear
      );
      const userList = getUniqueRecord(filteredList);

      // Calculate total hours (assuming each day has 3 sections)
      const semesterStart = `${moment().year()}-01-01`; // Adjust if needed
      const today = moment();
      const totalDays = today.diff(moment(semesterStart), "days") + 1;
      const totalHours = totalDays * 3;

      if (userList.length === 0) {
        setRowData([]);
      } else {
        const updatedUserList = userList.map((student) => {
          let absentCount = 0;
          attendanceList.forEach((record) => {
            if (record.Rollno === student.Rollno) {
              if (record.absent1) absentCount++;
              if (record.absent2) absentCount++;
              if (record.absent3) absentCount++;
            }
          });

          dayArray.forEach((date) => {
            if (isAbsent1(student.Rollno, date)) absentCount++;
            if (isAbsent2(student.Rollno, date)) absentCount++;
            if (isAbsent3(student.Rollno, date)) absentCount++;

            student[`day${date}-1`] = isAbsent1(student.Rollno, date) || false;
            student[`day${date}-2`] = isAbsent2(student.Rollno, date) || false;
            student[`day${date}-3`] = isAbsent3(student.Rollno, date) || false;
          });

          return {
            ...student,
            absentHours: absentCount,
            presentHours: totalHours - absentCount,
            attendancePercentage: (
              ((totalHours - absentCount) / totalHours) *
              100
            ).toFixed(2),
          };
        });

        setRowData(updatedUserList);
      }

      // Define column definitions
      setColDef(() => [
        { field: "Rollno", pinned: "left" },
        { field: "name", pinned: "left" },
        {
          headerName: "Total Hours",
          field: "totalHours",
          valueGetter: () => totalHours,
          width: 120,
        },
        { headerName: "Present Hours", field: "presentHours", width: 120 },
        {
          headerName: "Attendance (%)",
          field: "attendancePercentage",
          width: 120,
        },
        ...dayArray.flatMap((date) => {
          const dayEditable = isDayEditable(date);
          return {
            headerName: `${getDayWithSuffix(date)} ${moment(
              selectedMonth
            ).format("MMM")}`,
            marryChildren: true,
            children: [
              {
                headerName: "Morning",
                field: `day${date}-1`,
                editable: dayEditable,
                cellRenderer: CheckboxRenderer,
                cellStyle: { textAlign: "center" },
                width: 100,
                cellRendererParams: { dayEditable },
              },
              {
                headerName: "Midday",
                field: `day${date}-2`,
                editable: dayEditable,
                cellRenderer: CheckboxRenderer,
                cellStyle: { textAlign: "center" },
                width: 100,
                cellRendererParams: { dayEditable },
              },
              {
                headerName: "Afternoon",
                field: `day${date}-3`,
                editable: dayEditable,
                cellRenderer: CheckboxRenderer,
                cellStyle: { textAlign: "center" },
                width: 100,
                cellRendererParams: { dayEditable },
              },
            ],
          };
        }),
      ]);
    }
  }, [attendanceList, selectedMonth, selectedYear]);

  // Checkbox renderer for attendance marking
  const CheckboxRenderer = (props) => {
    const { value } = props;
    const { dayEditable } = props.colDef.cellRendererParams || {};

    return (
      <input
        type="checkbox"
        checked={props.value}
        disabled={!dayEditable}
        onChange={(e) => {
          if (dayEditable) {
            props.node.setDataValue(props.colDef.field, e.target.checked);
          }
        }}
        style={{
          width: "20px",
          height: "20px",
          cursor: dayEditable ? "pointer" : "not-allowed",
        }}
      />
    );
  };

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDef}
          onCellValueChanged={(e) => {
            const dayEditable = e.colDef.editable;
            if (dayEditable) {
              markAttendance(e.colDef.field, e.data.Rollno, e.newValue);
            } else {
              toast.error(
                "Attendance for this day is locked and cannot be changed."
              );
            }
          }}
        />
      </div>
    </div>
  );
}

export default AttendanceGrid;
