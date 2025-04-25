'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui';
import { StreamingLineChart } from '../components/charts';
import NewsWidget from '../components/NewsWidget';
import Image from 'next/image';

export default function Home() {
  const [streamingData, setStreamingData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1m');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const labelsResponse = await fetch('/api/labels');
        const streamingResponse = await fetch('/api/streaming');
        const newsResponse = await fetch('/api/news');

        const labelsData = await labelsResponse.json();
        const streamingData = await streamingResponse.json();
        const newsData = await newsResponse.json();

        setLabels(labelsData.labels);
        
        // Filtrar datos según el rango de tiempo seleccionado
        const filteredData = filterDataByTimeRange(streamingData.data, selectedTimeRange);
        setStreamingData(filteredData);
        
        setNews(newsData.news.slice(0, 5)); // Mostrar solo las 5 noticias más recientes
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeRange]);

  // Función para filtrar datos según el rango de tiempo
  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '5d':
        startDate.setDate(now.getDate() - 5);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1a':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // Para 'Máx.' devolvemos todos los datos
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  const handleLabelSelect = (label) => {
    setSelectedLabel(label);
    // En un entorno real, aquí cargaríamos noticias específicas del sello seleccionado
  };

  // Formatear datos para el gráfico
  const formatChartData = (data) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      Sony: item.labels.sony,
      Universal: item.labels.universal,
      Warner: item.labels.warner,
      Independientes: item.labels.independent
    }));
  };

  // Calcular porcentajes de mercado para el último día
  const calculateMarketShare = () => {
    if (streamingData.length === 0) return [];
    
    const latestData = streamingData[streamingData.length - 1];
    const total = latestData.total;
    
    return [
      { name: 'Sony', value: Math.round((latestData.labels.sony / total) * 100) },
      { name: 'Universal', value: Math.round((latestData.labels.universal / total) * 100) },
      { name: 'Warner', value: Math.round((latestData.labels.warner / total) * 100) },
      { name: 'Independientes', value: Math.round((latestData.labels.independent / total) * 100) }
    ];
  };

  return (
    <div>
      <div className="dashboard-welcome">
        <h1>Market Share Analysis</h1>
        <p>Monitoreo de streams de Spotify para los principales sellos discográficos</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Streams por Sello Discográfico</h2>
          <div className="time-filter">
            <div 
              className={`time-filter-option ${selectedTimeRange === '1d' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('1d')}
            >
              1d
            </div>
            <div 
              className={`time-filter-option ${selectedTimeRange === '5d' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('5d')}
            >
              5d
            </div>
            <div 
              className={`time-filter-option ${selectedTimeRange === '1m' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('1m')}
            >
              1m
            </div>
            <div 
              className={`time-filter-option ${selectedTimeRange === '3m' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('3m')}
            >
              3m
            </div>
            <div 
              className={`time-filter-option ${selectedTimeRange === '1a' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('1a')}
            >
              1a
            </div>
            <div 
              className={`time-filter-option ${selectedTimeRange === 'max' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('max')}
            >
              Máx.
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          {isLoading ? (
            <div className="loading">Cargando datos...</div>
          ) : (
            <StreamingLineChart data={formatChartData(streamingData)} />
          )}
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card title="Sellos Discográficos">
            <div className="labels-container">
              {labels.map(label => (
                <div 
                  key={label.id}
                  className={`label-card label-card-${label.id}`}
                  onClick={() => handleLabelSelect(label)}
                >
                  <div className="label-icon" style={{ backgroundColor: label.color }}></div>
                  <div className="label-info">
                    <div className="label-name">{label.name}</div>
                    <div className="label-stats">
                      <span className="trend-up">+12.5%</span> este mes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Cuota de Mercado Actual">
            <div className="market-share-container">
              {calculateMarketShare().map(item => (
                <div key={item.name} className="market-share-item">
                  <div className="share-label">{item.name}</div>
                  <div className="share-bar-container">
                    <div 
                      className={`share-bar share-bar-${item.name.toLowerCase()}`} 
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: 
                          item.name === 'Sony' ? '#003DA5' : 
                          item.name === 'Universal' ? '#FF0000' : 
                          item.name === 'Warner' ? '#0046bd' : '#32CD32'
                      }}
                    ></div>
                  </div>
                  <div className="share-value">{item.value}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="dashboard-column">
          <Card title="Noticias Recientes">
            <NewsWidget />
          </Card>
          
          <Card title="Accesos Rápidos">
            <div className="quick-links">
              <a href="/label/warner" className="quick-link">
                <div className="quick-link-icon" style={{ backgroundColor: '#0046bd' }}></div>
                <div className="quick-link-text">Warner Music Group</div>
              </a>
              <a href="/label/sony" className="quick-link">
                <div className="quick-link-icon" style={{ backgroundColor: '#003DA5' }}></div>
                <div className="quick-link-text">Sony Music Entertainment</div>
              </a>
              <a href="/label/universal" className="quick-link">
                <div className="quick-link-icon" style={{ backgroundColor: '#FF0000' }}></div>
                <div className="quick-link-text">Universal Music Group</div>
              </a>
              <a href="/news" className="quick-link">
                <div className="quick-link-icon" style={{ backgroundColor: '#666666' }}></div>
                <div className="quick-link-text">Todas las Noticias</div>
              </a>
              <a href="/admin" className="quick-link">
                <div className="quick-link-icon" style={{ backgroundColor: '#333333' }}></div>
                <div className="quick-link-text">Administración</div>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
