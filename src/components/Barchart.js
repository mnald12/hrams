import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
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
    Absent: 4,
    Late: 3,
    Leave: 6,
  },
  {
    name: "Tuesday",
    Absent: 12,
    Late: 4,
    Leave: 22,
  },
  {
    name: "Wednesday",
    Absent: 6,
    Late: 8,
    Leave: 4,
  },
  {
    name: "Thursday",
    Absent: 32,
    Late: 1,
    Leave: 22,
  },
  {
    name: "Friday",
    Absent: 3,
    Late: 44,
    Leave: 22,
  },
  {
    name: "Saturday",
    Absent: 2,
    Late: 1,
    Leave: 4,
  },
];

export default class Barchart extends PureComponent {
  static demoUrl = "https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5";

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
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
          <Bar
            dataKey="Late"
            fill="orange"
            activeBar={<Rectangle fill="pink" stroke="orange" />}
          />
          <Bar
            dataKey="Absent"
            fill="red"
            activeBar={<Rectangle fill="gold" stroke="red" />}
          />
          <Bar
            dataKey="Leave"
            fill="darkviolet"
            activeBar={<Rectangle fill="gold" stroke="darkviolet" />}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
