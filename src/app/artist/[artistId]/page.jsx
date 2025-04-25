'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import { 
  StreamingLineChart, 
  ArtistBarChart, 
  TrackBarChart 
} from '../components/charts';

export default function ArtistDetail({ params }) {
  const { artistId } = params;
  const [artist, setArtist] = useState(null);
  const [streamingData, setStreamingData] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1m');

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const artistsResponse = await fetch('/api/artists');
        const newsResponse = await fetch('/api/news');

        const artistsData = await artistsResponse.json();
        const newsData = await newsResponse.json();

        // Encontrar el artista seleccionado
        const selectedArtist = artistsData.artists.find(a => a.id === artistId);
        setArtist(selectedArtist);
        
        // Generar datos de streaming simulados para el artista
        const streamingData = generateArtistStreamingData(selectedArtist);
        
        // Filtrar datos según el rango de tiempo seleccionado
        const filteredData = filterDataByTimeRange(streamingData, selectedTimeRange);
        setStreamingData(filteredData);
        
        // Filtrar noticias relacionadas con el artista
        const artistNews = newsData.news.filter(n => 
          n.related_entity.type === 'artist' && n.related_entity.id === artistId
        );
        setNews(artistNews);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    if (artistId) {
      fetchData();
    }
  }, [artistId, selectedTimeRange]);

  // Función para generar datos de streaming simulados para el artista
  const generateArtistStreamingData = (artist) => {
    if (!artist) return [];
    
    const data = [];
    const now = new Date();
    const startDate = new Date();
    startDate.setFullYear(now.getFullYear() - 1);
    
    let currentDate = new Date(startDate);
    const baseValue = artist.monthly_listeners / 30; // Streams diarios aproximados
    
    while (currentDate <= now) {
      const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
      const trend = 1 + (Math.sin(daysDiff / 30) * 0.2); // Variación sinusoidal para simular tendencias
      const randomFactor = 0.9 + (Math.random() * 0.2); // Entre 0.9 y 1.1
      
      // Aplicar variación semanal (más streams los fines de semana)
      const dayOfWeek = currentDate.getDay(); // 0 = domingo, 6 = sábado
      const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) ? 1.15 : 1;
      
      // Calcular valor final
      const value = Math.round(baseValue * trend * randomFactor * weekendBoost);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        streams: value
      });
      
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

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
      Streams: item.streams
    }));
  };

  // Formatear datos para el gráfico de tracks
  const formatTrackChartData = (artist) => {
    if (!artist || !artist.top_tracks) return [];
    
    return artist.top_tracks.map(track => ({
      title: track.title,
      streams: track.streams,
      daily_streams: track.daily_streams
    }));
  };

  if (isLoading || !artist) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <a href="/">Dashboard</a> &gt; 
        <a href={`/label/${artist.label_id}`}>{artist.label_name}</a> &gt; 
        {artist.name}
      </div>
      
      <div className="artist-header">
        <h1 className="page-title">{artist.name}</h1>
        <div className="artist-meta">
          <span className="artist-genre">{artist.genre}</span>
          <span className="artist-listeners">{artist.monthly_listeners.toLocaleString()} oyentes mensuales</span>
        </div>
      </div>
      
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
          
          <Card title="Tracks Más Populares">
            <TrackBarChart data={formatTrackChartData(artist)} />
          </Card>
        </div>
        
        <div className="dashboard-column">
          <Card title="Información del Artista">
            <div className="artist-info">
              <div className="info-item">
                <span className="info-label">Sello Discográfico:</span>
                <span className="info-value">{artist.label_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Género:</span>
                <span className="info-value">{artist.genre}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Oyentes Mensuales:</span>
                <span className="info-value">{artist.monthly_listeners.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tracks Populares:</span>
                <span className="info-value">{artist.top_tracks.length}</span>
              </div>
            </div>
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
                <div className="no-news">No hay noticias recientes para este artista.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
