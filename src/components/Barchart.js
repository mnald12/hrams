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
  { name: "OOTM", absent: 45, late: 67, leave: 23 },
  { name: "OOTVM", absent: 78, late: 55, leave: 34 },
  { name: "OOTSTTSB", absent: 90, late: 44, leave: 29 },
  { name: "OOTMT", absent: 56, late: 88, leave: 41 },
  { name: "OOTMAssesor", absent: 67, late: 72, leave: 38 },
  { name: "OOTMAccountant", absent: 82, late: 49, leave: 19 },
  { name: "OOTMBO", absent: 94, late: 61, leave: 22 },
  { name: "OOTMPADC", absent: 39, late: 77, leave: 31 },
  { name: "OOTME", absent: 71, late: 59, leave: 40 },
  { name: "OOTMHO", absent: 83, late: 92, leave: 25 },
  { name: "OOTMCR", absent: 65, late: 73, leave: 30 },
  { name: "OOTMDRRAMO", absent: 48, late: 86, leave: 20 },
  { name: "OOTMHRMO", absent: 79, late: 58, leave: 26 },
  { name: "OOTMAgri", absent: 88, late: 64, leave: 35 },
  { name: "OOTMSWADO", absent: 92, late: 70, leave: 28 },
  { name: "OOTMGSO", absent: 53, late: 81, leave: 21 },
  { name: "OOTMEANRO", absent: 74, late: 66, leave: 37 },
  { name: "OOTMTO", absent: 89, late: 50, leave: 32 },
  { name: "OOTMNAO", absent: 77, late: 80, leave: 27 },
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
            dataKey="late"
            fill="orange"
            activeBar={<Rectangle fill="orange" stroke="orange" />}
          />
          <Bar
            dataKey="absent"
            fill="red"
            activeBar={<Rectangle fill="red" stroke="red" />}
          />
          <Bar
            dataKey="leave"
            fill="darkred"
            activeBar={<Rectangle fill="darkred" stroke="darkred" />}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
