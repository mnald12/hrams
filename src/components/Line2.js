import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getLatesData, getLeaveData } from "../methods/methods";

let data = [];

Promise.all([getLeaveData(), getLatesData()]).then(
  ([leaveResult, lateResult]) => {
    let leaveData = leaveResult.monthlyArray;
    let lateData = lateResult.monthlyArray;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let mergedData = {};
    months.forEach((month) => {
      mergedData[month] = { name: month, late: 0, leave: 0 };
    });

    lateData.forEach((item) => {
      if (mergedData[item.name]) {
        mergedData[item.name].late = item.late;
      }
    });

    leaveData.forEach((item) => {
      if (mergedData[item.name]) {
        mergedData[item.name].leave = item.leave;
      }
    });

    data = Object.values(mergedData);
  }
);

export default class Line2 extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="late" stroke="orange" />
          <Line type="monotone" dataKey="leave" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
