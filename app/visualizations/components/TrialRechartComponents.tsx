// app/clinicaltrials/components/TrialRechartComponents.tsx
'use client';

import React, { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts';

// Types
interface TreemapContentProps {
  root?: any;
  depth?: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface TrialRechartComponentsProps {
  data: ChartData[];
  chartType: 'bar' | 'pie' | 'treemap';
  visualizationType: 'phases' | 'status' | 'sponsors' | 'timeline' | 'conditions';
  onDataClick: (entry: any) => void;
}

// Color constants
const PHASE_COLORS = {
  'Phase 1': '#8884d8',
  'Phase 1/2': '#83a6ed',
  'Phase 2': '#8dd1e1',
  'Phase 2/3': '#82ca9d',
  'Phase 3': '#a4de6c',
  'Phase 4': '#d0ed57',
  'Not Specified': '#ffc658',
};

const STATUS_COLORS = {
  Recruiting: '#4caf50',
  'Active, not recruiting': '#2196f3',
  Completed: '#9c27b0',
  Terminated: '#f44336',
  Withdrawn: '#ff9800',
  Suspended: '#ffeb3b',
  'Unknown status': '#9e9e9e',
};

// Custom colors for various chart types
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#8DD1E1'];

// Memoized TreemapContent component
const TreemapContent = memo(({ root }: TreemapContentProps) => {
  if (!root || !root.children) return null;

  return (
    <g>
      {root.children.map((node: any, index: number) => {
        const fontSize = Math.min(node.width / 10, 12);
        const showText = node.width > 50 && node.height > 30;

        return (
          <g key={index}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              style={{
                fill: COLORS[index % COLORS.length],
                stroke: '#fff',
                strokeWidth: 1,
                opacity: 0.9,
                cursor: 'pointer',
              }}
            />
            {showText && (
              <>
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2}
                  style={{
                    fontSize,
                    textAnchor: 'middle',
                    fill: '#fff',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    dominantBaseline: 'middle',
                  }}
                >
                  {node.name}
                </text>
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 + fontSize + 2}
                  style={{
                    fontSize: fontSize - 2,
                    textAnchor: 'middle',
                    fill: '#fff',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    dominantBaseline: 'middle',
                  }}
                >
                  {node.value}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
});

TreemapContent.displayName = 'TreemapContent';

function getVisualTypeLabel(type: string) {
  switch (type) {
    case 'phases':
      return 'Phase';
    case 'status':
      return 'Status';
    case 'sponsors':
      return 'Sponsor';
    case 'timeline':
      return 'Month';
    case 'conditions':
      return 'Condition';
    default:
      return '';
  }
}

function getColorForItem(type: string, name: string, index: number) {
  if (type === 'phases') {
    return (PHASE_COLORS as any)[name] || COLORS[index % COLORS.length];
  }
  if (type === 'status') {
    return (STATUS_COLORS as any)[name] || COLORS[index % COLORS.length];
  }
  return COLORS[index % COLORS.length];
}

// Format timeline labels to be more readable
function formatTimelineLabel(label: string) {
  if (label.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = label.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  }
  return label;
}

const TrialRechartComponents = memo(
  ({ data, chartType, visualizationType, onDataClick }: TrialRechartComponentsProps) => {
    // Process the data for timeline if needed
    const chartData =
      visualizationType === 'timeline'
        ? data.map((item) => ({ ...item, name: formatTimelineLabel(item.name) }))
        : data;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              layout={visualizationType === 'timeline' ? 'vertical' : 'vertical'}
              margin={{ left: 150 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, getVisualTypeLabel(visualizationType)]}
              />
              {visualizationType === 'phases' || visualizationType === 'status' ? (
                <Bar dataKey="value" onClick={onDataClick} style={{ cursor: 'pointer' }}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorForItem(visualizationType, entry.name, index)}
                    />
                  ))}
                </Bar>
              ) : (
                <Bar
                  dataKey="value"
                  fill="var(--mantine-primary-color-filled)"
                  onClick={onDataClick}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={200}
                label={(entry) => entry.name}
                onClick={onDataClick}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorForItem(visualizationType, entry.name, index)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [value, getVisualTypeLabel(visualizationType)]}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <Treemap
              data={chartData}
              dataKey="value"
              aspectRatio={1}
              onClick={(node) => {
                if (node && node.name) {
                  onDataClick({ name: node.name, value: node.value });
                }
              }}
              content={<TreemapContent />}
              isAnimationActive={false}
            />
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  }
);

TrialRechartComponents.displayName = 'TrialRechartComponents';

export default TrialRechartComponents;
