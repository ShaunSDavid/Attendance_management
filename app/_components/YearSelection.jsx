"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "../services/GlobalApi";

function YearSelection({ selectedYear }) {
  const [year, setYear] = useState([]);
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
      <select
        className="p-3 border rounded-lg"
        onChange={(e) => selectedYear(e.target.value)}
      >
        {year.map((item, index) => (
          <option key={index} value={item.yearNo}>
            {item.yearNo}
          </option>
        ))}
      </select>
    </div>
  );
}

export default YearSelection;
