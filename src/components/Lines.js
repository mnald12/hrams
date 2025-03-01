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

const data = [
  {
    name: "Monday",
    Late: 20,
    Absent: 2,
    Leave: 3,
  },
  {
    name: "Tuesday",
    Late: 11,
    Absent: 5,
    Leave: 3,
  },
  {
    name: "Wednesday",
    Late: 8,
    Absent: 0,
    Leave: 2,
  },
  {
    name: "Thursday",
    Late: 18,
    Absent: 4,
    Leave: 2,
  },
  {
    name: "Friday",
    Late: 22,
    Absent: 5,
    Leave: 3,
  },
];

export default class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952";

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
          <Line type="monotone" dataKey="Late" stroke="orange" />
          <Line
            type="monotone"
            dataKey="Absent"
            stroke="red"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Leave" stroke="darkviolet" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
