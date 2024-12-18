import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { Button } from "@/components/ui/button";
import { Search, Trash } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GlobalApi from "@/app/services/GlobalApi";
import { toast } from "sonner";

function StudentList({ studentList, refreshData }) {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [25, 50, 100];

  const deleteRecord = (id) => {
    GlobalApi.deleteStudent(id).then((resp) => {
      if (resp) {
        toast("Record Deleted!");
        refreshData();
      }
    });
  };
  const CustomButtons = (props) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              row and remove your data from database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRecord(props.data.id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  const [colDef, setColDef] = useState([
    { field: "id", filter: true },
    { field: "name", filter: true },
    { field: "regno", filter: true },
    { field: "rollno", filter: true },
    { field: "action", cellRenderer: CustomButtons },
  ]);

  const [rowData, setRowData] = useState([]);
  const [searchData, setSearchData] = useState();
  useEffect(() => studentList && setRowData(studentList), [studentList]);
  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <br />
      <div className="flex justify-between items-center">
        <Card className="max-w-sm ">
          <CardHeader>
            <CardTitle>Total Students: </CardTitle>
          </CardHeader>
        </Card>
        <div className="p-2 rounded-lg border shadow-sm mb-2 flex gap-2 max-w-80">
          <Search />
          <input
            type="text"
            placeholder="Student Name"
            className="outline-none w-full"
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDef}
        quickFilterText={searchData}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default StudentList;
