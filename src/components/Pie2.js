import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Late", value: 1300 },
  { name: "Absent", value: 800 },
  { name: "Leave", value: 200 },
];

const COLORS = ["orange", "red", "darkviolet"];

export default class Pie2 extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj";

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={500} height={500}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={""}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
