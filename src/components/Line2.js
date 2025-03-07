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
    name: "Jan",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Feb",
    Late: 0,
    Leave: 3,
  },
  {
    name: "Mar",
    Late: 0,
    Leave: 1,
  },
  {
    name: "Apr",
    Late: 0,
    Leave: 0,
  },
  {
    name: "May",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Jun",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Jul",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Aug",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Sep",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Oct",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Nov",
    Late: 0,
    Leave: 0,
  },
  {
    name: "Dec",
    Late: 0,
    Leave: 0,
  },
];

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
          <Line type="monotone" dataKey="Late" stroke="orange" />
          <Line type="monotone" dataKey="Leave" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
