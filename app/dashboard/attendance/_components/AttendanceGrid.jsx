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

  const DaysofMonth = (year, month) => new Date(year, month, 0).getDate();
  const numberOfDays = DaysofMonth(
    moment(selectedMonth).format("yyyy"),
    moment(selectedMonth).format("MM")
  );
  const dayArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

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

  const isDayEditable = (day) => {
    const today = moment();
    const cellDate = moment(selectedMonth).date(day);
    return cellDate.isSameOrAfter(today, "day");
  };

  // const deleteFalseRecords = () => {
  //   attendanceList.forEach((record) => {
  //     const isFalse =
  //       record.absent1 == false &&
  //       record.absent2 == false &&
  //       record.absent3 == false;

  //     if (isFalse) {
  //       GlobalApi.deleteAttendanceRecord({
  //         Rollno: record.Rollno,
  //         date: record.date,
  //         day: record.day,
  //       })
  //         .then((resp) => {
  //           console.log(`Record for Rollno ${record.Rollno} deleted`, resp);
  //         })
  //         .catch((err) => {
  //           console.error(
  //             `Failed to delete record for Rollno ${record.Rollno}`,
  //             err
  //           );
  //         });
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (attendanceList) {
  //     const filteredList = attendanceList.filter(
  //       (record) => record.year === selectedYear
  //     );
  //     const userList = getUniqueRecord(filteredList);

  //     if (userList.length === 0) {
  //       // If there are no students for this month, initialize rowData with placeholders
  //       setRowData([]);
  //     } else {
  //       const semesterStart = moment().year() + "-01-01"; // Adjust to actual semester start date
  //       const today = moment();
  //       const totalDays = today.diff(moment(semesterStart), "days") + 1;
  //       const totalHours = totalDays * 3; // Since each day has 3 sections

  //       userList.forEach((student) => {
  //         let absentCount = 0;
  //         dayArray.forEach((date) => {
  //           if (isAbsent1(student.Rollno, date)) absentCount++;
  //           if (isAbsent2(student.Rollno, date)) absentCount++;
  //           if (isAbsent3(student.Rollno, date)) absentCount++;
  //         });

  //         student.absentHours = absentCount;
  //         student.presentHours = totalHours - absentCount;
  //         student.attendancePercentage = (
  //           (student.presentHours / totalHours) *
  //           100
  //         ).toFixed(2);
  //       });
  //       setRowData(userList);
  //     }
  //     const summaryColumns = [
  //       {
  //         headerName: "Total Hours",
  //         field: "totalHours",
  //         valueGetter: () => totalHours,
  //         width: 120,
  //       },
  //       { headerName: "Present Hours", field: "presentHours", width: 120 },
  //       {
  //         headerName: "Attendance (%)",
  //         field: "attendancePercentage",
  //         width: 120,
  //       },
  //     ];

  //     const DayColumns = dayArray.flatMap((date) => {
  //       const dayEditable = isDayEditable(date);
  //       return {
  //         headerName: `${getDayWithSuffix(date)} ${moment(selectedMonth).format(
  //           "MMM"
  //         )}`,
  //         marryChildren: true,
  //         children: [
  //           {
  //             headerName: `Morning`,
  //             field: `day${date}-1`,
  //             editable: dayEditable,
  //             cellRenderer: CheckboxRenderer,
  //             cellStyle: (params) => ({
  //               textAlign: "center",
  //             }),
  //             width: 100,
  //             cellRendererParams: { dayEditable },
  //           },
  //           {
  //             headerName: `Midday`,
  //             field: `day${date}-2`,
  //             editable: dayEditable,
  //             cellRenderer: CheckboxRenderer,
  //             cellStyle: (params) => ({
  //               textAlign: "center",
  //             }),
  //             width: 100,
  //             cellRendererParams: { dayEditable },
  //           },
  //           {
  //             headerName: `Afternoon`,
  //             field: `day${date}-3`,
  //             editable: dayEditable,
  //             cellRenderer: CheckboxRenderer,
  //             cellStyle: (params) => ({
  //               textAlign: "center",
  //             }),
  //             width: 100,
  //             cellRendererParams: { dayEditable },
  //           },
  //         ],
  //       };
  //     });

  //     // Used for checking if the student is present or not
  //     dayArray.forEach((date) => {
  //       userList.forEach((obj) => {
  //         obj[`day${date}-1`] = isAbsent1(obj.Rollno, date) || false;
  //         obj[`day${date}-2`] = isAbsent2(obj.Rollno, date) || false;
  //         obj[`day${date}-3`] = isAbsent3(obj.Rollno, date) || false;
  //       });
  //     });

  //     setColDef(() => [
  //       {
  //         field: "Rollno",
  //         pinned: "left",
  //       },
  //       { field: "name", pinned: "left" },
  //       ...summaryColumns,
  //       ...DayColumns,
  //     ]);
  //     //deleteFalseRecords();
  //     // setRowData(userList);
  //   }
  // }, [attendanceList, selectedMonth, selectedYear]);

  useEffect(() => {
    if (attendanceList) {
      const filteredList = attendanceList.filter(
        (record) => record.year === selectedYear
      );
      const userList = getUniqueRecord(filteredList);

      // Ensure totalHours is defined in the correct scope
      const semesterStart = `${moment().year()}-01-01`; // Adjust if needed
      const today = moment();
      const totalDays = today.diff(moment(semesterStart), "days") + 1;
      const totalHours = totalDays * 3; // Since each day has 3 sections

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

      setColDef(() => [
        { field: "Rollno", pinned: "left" },
        { field: "name", pinned: "left" },
        {
          headerName: "Total Hours",
          field: "totalHours",
          valueGetter: () => totalHours, // Now correctly defined
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

  const isAbsent1 = (Rollno, day) => {
    const result = attendanceList.find(
      (item) => item.day == day && item.Rollno == Rollno && item.absent1 == true
    );
    return result ? true : false;
  };
  const isAbsent2 = (Rollno, day) => {
    const result = attendanceList.find(
      (item) => item.day == day && item.Rollno == Rollno && item.absent2 == true
    );
    return result ? true : false;
  };
  const isAbsent3 = (Rollno, day) => {
    const result = attendanceList.find(
      (item) => item.day == day && item.Rollno == Rollno && item.absent3 == true
    );
    return result ? true : false;
  };

  //Used to return the unique record in the attendance list
  const getUniqueRecord = (filteredAttendanceList) => {
    const uniqueRecord = [];
    const existingRecord = new Set();
    const filteredStudentList = studentList.filter(
      (record) => record.year === selectedYear
    );

    filteredAttendanceList.forEach((record) => {
      if (!existingRecord.has(record.Rollno)) {
        existingRecord.add(record.Rollno);
        uniqueRecord.push(record);
      }
    });

    if (uniqueRecord.length === 0) {
      filteredStudentList.forEach((record) => {
        uniqueRecord.push({
          Rollno: record.rollno,
          name: record.name,
          absent1: false,
          absent2: false,
          absent3: false,
          // Add empty days dynamically
          ...Object.fromEntries(
            dayArray.flatMap((date) => [
              [`day${date}-1`, false],
              [`day${date}-2`, false],
              [`day${date}-3`, false],
            ])
          ),
        });
      });
    }
    return uniqueRecord;
  };

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

  const markAttendance = (daySection, Rollno, absentStatus) => {
    const date = moment(selectedMonth).format("MM/yyyy");
    const day = parseInt(daySection.match(/day(\d+)-\d/)[1]);

    if (!isDayEditable(day)) {
      toast.error("Attendance for this day is locked and cannot be changed.");
      return;
    }

    const data = {
      Rollno: Rollno,
      date: date,
      day: day,
    };

    if (daySection.endsWith("-1")) {
      data.absent1 = absentStatus;
    } else if (daySection.endsWith("-2")) {
      data.absent2 = absentStatus;
    } else if (daySection.endsWith("-3")) {
      data.absent3 = absentStatus;
    }

    GlobalApi.markAttendance(data).then((resp) => {
      console.log(resp);
      toast(
        absentStatus ? "Student Marked as Absent" : "Student Marked as Present"
      );
    });
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
