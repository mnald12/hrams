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
    Leave: 3,
  },
  {
    name: "Tuesday",
    Late: 11,
    Leave: 3,
  },
  {
    name: "Wednesday",
    Late: 8,
    Leave: 2,
  },
  {
    name: "Thursday",
    Late: 18,
    Leave: 2,
  },
  {
    name: "Friday",
    Late: 22,
    Leave: 3,
  },
];

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
          <Line type="monotone" dataKey="Late" stroke="orange" />
          <Line type="monotone" dataKey="Leave" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
