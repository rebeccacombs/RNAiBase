'use client';

import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Treemap } from 'recharts';

interface TreemapContentProps {
  root?: any;
  depth?: number;
}

interface ChartProps {
  data: any[];
  chartType: string;
  visualizationType: string;
  onDataClick: (entry: any) => void;
}

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
                fill: 'var(--mantine-primary-color-filled)',
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
                    dominantBaseline: 'middle'
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
                    dominantBaseline: 'middle'
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
    case 'keywords':
      return 'Keywords';
    case 'journals':
      return 'Journal';
    case 'authors':
      return 'Author';
    case 'timeline':
      return 'Month';
    default:
      return '';
  }
}

const RechartComponents = memo(({ 
  data, 
  chartType, 
  visualizationType, 
  onDataClick 
}: ChartProps) => {
  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" margin={{ left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip 
              formatter={(value: number) => [value, getVisualTypeLabel(visualizationType)]}
            />
            <Bar 
              dataKey="value" 
              fill="var(--mantine-primary-color-filled)"
              onClick={onDataClick}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              fill="var(--mantine-primary-color-filled)"
              label={(entry) => entry.name}
              onClick={onDataClick}
              style={{ cursor: 'pointer' }}
            />
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
            data={data}
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
});

RechartComponents.displayName = 'RechartComponents';

export default RechartComponents;