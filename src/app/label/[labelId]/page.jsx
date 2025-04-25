'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import { 
  StreamingLineChart, 
  ArtistBarChart, 
  LabelPieChart, 
  StreamingAreaChart,
  TrackBarChart 
} from '../components/charts';

export default function LabelDetail({ params }) {
  const { labelId } = params;
  const [label, setLabel] = useState(null);
  const [streamingData, setStreamingData] = useState([]);
  const [artists, setArtists] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1m');

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const labelsResponse = await fetch('/api/labels');
        const streamingResponse = await fetch('/api/streaming');
        const artistsResponse = await fetch('/api/artists');
        const newsResponse = await fetch('/api/news');

        const labelsData = await labelsResponse.json();
        const streamingData = await streamingResponse.json();
        const artistsData = await artistsResponse.json();
        const newsData = await newsResponse.json();

        // Encontrar el sello seleccionado
        const selectedLabel = labelsData.labels.find(l => l.id === labelId);
        setLabel(selectedLabel);
        
        // Filtrar datos según el rango de tiempo seleccionado
        const filteredData = filterDataByTimeRange(streamingData.data, selectedTimeRange);
        setStreamingData(filteredData);
        
        // Filtrar artistas por sello
        const labelArtists = artistsData.artists.filter(a => a.label_id === labelId);
        setArtists(labelArtists);
        
        // Filtrar noticias relacionadas con el sello
        const labelNews = newsData.news.filter(n => 
          n.related_entity.type === 'label' && n.related_entity.id === labelId
        );
        setNews(labelNews);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    if (labelId) {
      fetchData();
    }
  }, [labelId, selectedTimeRange]);

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

  // Formatear datos para el gráfico de línea
  const formatLineChartData = (data) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      [label?.name]: item.labels[labelId]
    }));
  };

  // Formatear datos para el gráfico de artistas
  const formatArtistChartData = (artists) => {
    return artists
      .sort((a, b) => b.monthly_listeners - a.monthly_listeners)
      .slice(0, 10)
      .map(artist => ({
        name: artist.name,
        streams: artist.monthly_listeners
      }));
  };

  // Formatear datos para el gráfico de tracks
  const formatTrackChartData = (artists) => {
    const tracks = [];
    artists.forEach(artist => {
      artist.top_tracks.forEach(track => {
        tracks.push({
          title: track.title,
          artist: artist.name,
          streams: track.streams,
          daily_streams: track.daily_streams
        });
      });
    });
    
    return tracks
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);
  };

  if (isLoading || !label) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <a href="/">Dashboard</a> &gt; {label.name}
      </div>
      
      <h1 className="page-title">{label.name}</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card title="Streams a lo largo del tiempo">
            <div className="time-filter">
              <div 
                className={`time-filter-option ${selectedTimeRange === '1d' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('1d')}
              >
                1d
              </div>
              <div 
                className={`time-filter-option ${selectedTimeRange === '5d' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('5d')}
              >
                5d
              </div>
              <div 
                className={`time-filter-option ${selectedTimeRange === '1m' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('1m')}
              >
                1m
              </div>
              <div 
                className={`time-filter-option ${selectedTimeRange === '3m' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('3m')}
              >
                3m
              </div>
              <div 
                className={`time-filter-option ${selectedTimeRange === '1a' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('1a')}
              >
                1a
              </div>
              <div 
                className={`time-filter-option ${selectedTimeRange === 'max' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('max')}
              >
                Máx.
              </div>
            </div>
            <StreamingLineChart data={formatLineChartData(streamingData)} />
          </Card>
          
          <Card title="Artistas Más Populares">
            <ArtistBarChart data={formatArtistChartData(artists)} />
          </Card>
        </div>
        
        <div className="dashboard-column">
          <Card title="Tracks Más Populares">
            <TrackBarChart data={formatTrackChartData(artists)} />
          </Card>
          
          <Card title="Noticias Relacionadas">
            <div className="news-container">
              {news.length > 0 ? (
                news.map(item => (
                  <div key={item.id} className="news-item">
                    <div className="news-date">{new Date(item.date).toLocaleDateString('es-ES')}</div>
                    <div className="news-title">{item.title}</div>
                    <div className="news-content">{item.content.substring(0, 100)}...</div>
                    <div className="news-source">{item.source}</div>
                  </div>
                ))
              ) : (
                <div className="no-news">No hay noticias recientes para este sello.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
