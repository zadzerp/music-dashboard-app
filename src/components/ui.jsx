'use client';

import React from 'react';

export default function DashboardGrid({ children }) {
  return (
    <div className="dashboard-grid">
      {children}
    </div>
  );
}

export function DashboardColumn({ children }) {
  return (
    <div className="dashboard-column">
      {children}
    </div>
  );
}

export function Card({ title, children }) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export function LabelCard({ label, stats, onClick }) {
  return (
    <div 
      className={`label-card label-card-${label.id}`}
      onClick={() => onClick && onClick(label)}
    >
      <div className="label-icon" style={{ backgroundColor: label.color }}></div>
      <div className="label-info">
        <div className="label-name">{label.name}</div>
        {stats && (
          <div className="label-stats">
            <span className={stats.trend > 0 ? "trend-up" : "trend-down"}>
              {stats.trend > 0 ? '+' : ''}{stats.trend}%
            </span> {stats.period}
          </div>
        )}
      </div>
    </div>
  );
}

export function NewsItem({ news, onClick }) {
  return (
    <div className="news-item" onClick={() => onClick && onClick(news)}>
      <div className="news-date">
        {new Date(news.date).toLocaleDateString('es-ES')}
      </div>
      <div className="news-title">{news.title}</div>
      <div className="news-source">{news.source}</div>
    </div>
  );
}

export function TimeFilter({ selectedRange, onRangeChange }) {
  const ranges = [
    { id: '1d', label: '1d' },
    { id: '5d', label: '5d' },
    { id: '1m', label: '1m' },
    { id: '3m', label: '3m' },
    { id: '1a', label: '1a' },
    { id: 'max', label: 'Máx.' },
  ];
  
  return (
    <div className="time-filter">
      {ranges.map(range => (
        <div 
          key={range.id}
          className={`time-filter-option ${selectedRange === range.id ? 'active' : ''}`}
          onClick={() => onRangeChange(range.id)}
        >
          {range.label}
        </div>
      ))}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Cargando datos...</p>
    </div>
  );
}
