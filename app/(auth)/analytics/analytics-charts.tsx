'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

import type { ChartData } from '@/types/types';

type AnalyticsChartsProps = {
  contentData: {
    name: string;
    value: number;
  }[];
  chartData: ChartData;
};

const COLORS = [
  '#8884d8', // Blue - Blog Post
  '#82ca9d', // Green - Social Twitter
  '#ffc658', // Yellow - Social LinkedIn
  '#ff7c7c', // Red - Social Instagram
  '#a78bfa', // Purple - Email
  '#f472b6', // Pink - Product Desc
  '#fb923c', // Orange - Ad Copy
  '#94a3b8', // Gray - Other
  '#22d3ee', // Cyan - Images
];

export const AnalyticsCharts = ({
  contentData,
  chartData,
}: AnalyticsChartsProps) => {
  const topTypes = contentData.sort((a, b) => b.value - a.value).slice(0, 4);
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="content"
            stroke="#8884d8"
            name="Content"
          />
          <Line
            type="monotone"
            dataKey="images"
            stroke="#82ca9d"
            name="Images"
          />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={contentData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {contentData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topTypes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
