"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import GlobalApi from "@/app/services/GlobalApi";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

function AddStudent({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    console.log("FormData", data);
    GlobalApi.createStudent(data).then((resp) => {
      if (resp.data) {
        reset();
        refreshData();
        setOpen(false);
        toast("New Student Added!");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllYearList();
  }, []);

  const getAllYearList = () => {
    GlobalApi.getAllYears().then((resp) => {
      setYear(resp.data);
    });
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add New Student</Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="py-2">
                  <label>Full Name</label>
                  <Input
                    placeholder="Eg John Doe"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="flex flex-col py-2 ">
                  <label>Select Year</label>
                  <select
                    className="p-3 border rounded-lg"
                    {...register("year", { required: true })}
                  >
                    {year.map((item, index) => (
                      <option key={index} value={item.yearNo}>
                        {item.yearNo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-2">
                  <label>Register No.</label>
                  <Input
                    type="number"
                    placeholder="Eg 3111211..."
                    {...register("regno", { required: true })}
                  />
                </div>
                <div className="py-2">
                  <label>Roll No.</label>
                  <Input
                    placeholder="Eg 21CS..."
                    {...register("rollno", { required: true })}
                  />
                </div>
                <div className="flex gap-3 items-center justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disable={loading}>
                    {loading ? <LoaderIcon className="animate-spin" /> : "Save"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddStudent;
