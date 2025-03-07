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
    let leaveData = leaveResult.weeklyArray;
    let lateData = lateResult.weeklyArray;

    let mergedData = {};

    lateData.forEach((item) => {
      mergedData[item.name] = { name: item.name, late: item.late, leave: 0 };
    });

    leaveData.forEach((item) => {
      if (mergedData[item.name]) {
        mergedData[item.name].leave = item.leave;
      } else {
        mergedData[item.name] = { name: item.name, late: 0, leave: item.leave };
      }
    });

    data = Object.values(mergedData);

    console.log(data);
  }
);

export default class Example extends PureComponent {
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
