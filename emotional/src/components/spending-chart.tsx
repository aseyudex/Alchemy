"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface SpendingEvent {
  id?: string
  time: string
  category: string
  amount: number
  description: string
}

interface SpendingChartProps {
  data: SpendingEvent[]
}

const transformData = (spendingEvents: SpendingEvent[]) => {
  const aggregatedData: { time: string; totalSpent: number }[] = []
  const spendingByTime: { [key: string]: number } = {}

  spendingEvents.forEach((event) => {
    const time = event.time.substring(0, 5); // Use only hour and minute
    if (spendingByTime[time]) {
      spendingByTime[time] += event.amount;
    } else {
      spendingByTime[time] = event.amount;
    }
  });

  const sortedTimes = Object.keys(spendingByTime).sort();

  sortedTimes.forEach((time) => {
    aggregatedData.push({ time, totalSpent: spendingByTime[time] });
  });

  return aggregatedData;
};

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = transformData(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalSpent"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}