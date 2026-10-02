"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  completed: number;
  total: number;
}

export default function CompletionChart({ completed, total }: Props) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: total - completed },
  ];

  return (
    <div style={{ height: 300, marginTop: 40 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
