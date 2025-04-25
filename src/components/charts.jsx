'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';

export function StreamingLineChart({ data, height = 300 }) {
  const [activeLabel, setActiveLabel] = useState(null);
  
  const handleLegendClick = (entry) => {
    setActiveLabel(activeLabel === entry.dataKey ? null : entry.dataKey);
  };
  
  const colors = {
    Sony: '#003DA5',
    Universal: '#FF0000',
    Warner: '#00A4E4',
    Independientes: '#32CD32'
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" stroke="#E0E0E0" />
        <YAxis stroke="#E0E0E0" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#2C3040', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Legend 
          onClick={handleLegendClick}
          wrapperStyle={{ paddingTop: '10px' }}
        />
        {Object.keys(colors).map(label => (
          <Line 
            key={label}
            type="monotone" 
            dataKey={label} 
            stroke={colors[label]} 
            activeDot={{ r: 8 }}
            strokeWidth={activeLabel === label || !activeLabel ? 2 : 1}
            opacity={activeLabel === label || !activeLabel ? 1 : 0.3}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ArtistBarChart({ data, height = 300 }) {
  const colors = {
    Sony: '#003DA5',
    Universal: '#FF0000',
    Warner: '#00A4E4',
    Independientes: '#32CD32'
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
        <XAxis type="number" stroke="#E0E0E0" />
        <YAxis dataKey="name" type="category" stroke="#E0E0E0" width={120} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#2C3040', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Legend />
        <Bar dataKey="streams" fill={colors.Sony} name="Streams Mensuales" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LabelPieChart({ data, height = 300 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const colors = ['#003DA5', '#FF0000', '#00A4E4', '#32CD32'];
  
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const renderActiveShape = (props) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value 
    } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="#E0E0E0">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#E0E0E0">
          {value.toLocaleString()} streams
        </text>
        <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill="#E0E0E0">
          {(percent * 100).toFixed(2)}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 20}
          fill={fill}
        />
      </g>
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#2C3040', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#FFFFFF' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StreamingAreaChart({ data, height = 300 }) {
  const colors = {
    Sony: '#003DA5',
    Universal: '#FF0000',
    Warner: '#00A4E4',
    Independientes: '#32CD32'
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" stroke="#E0E0E0" />
        <YAxis stroke="#E0E0E0" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#2C3040', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Legend />
        {Object.keys(colors).map(label => (
          <Area 
            key={label}
            type="monotone" 
            dataKey={label} 
            stackId="1"
            stroke={colors[label]} 
            fill={colors[label]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrackBarChart({ data, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="title" stroke="#E0E0E0" />
        <YAxis stroke="#E0E0E0" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#2C3040', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Legend />
        <Bar dataKey="streams" fill="#4A90E2" name="Streams Totales" />
        <Bar dataKey="daily_streams" fill="#82ca9d" name="Streams Diarios" />
      </BarChart>
    </ResponsiveContainer>
  );
}
