'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';

export default function NewsWidget({ entityType, entityId, limit = 5 }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const newsResponse = await fetch('/api/news');
        const newsData = await newsResponse.json();
        
        // Filtrar noticias según el tipo y ID de entidad
        let filteredNews = [];
        
        if (entityType === 'label') {
          // Noticias directamente relacionadas con el sello
          const directNews = newsData.news.filter(n => 
            n.related_entity.type === 'label' && n.related_entity.id === entityId
          );
          
          // Noticias de artistas del sello
          const artistNews = newsData.news.filter(n => 
            n.related_entity.type === 'artist' && n.related_entity.label_id === entityId
          );
          
          filteredNews = [...directNews, ...artistNews];
        } else if (entityType === 'artist') {
          filteredNews = newsData.news.filter(n => 
            n.related_entity.type === 'artist' && n.related_entity.id === entityId
          );
        } else {
          // Si no se especifica tipo o ID, mostrar las noticias más recientes
          filteredNews = newsData.news;
        }
        
        // Ordenar por fecha (más recientes primero) y limitar cantidad
        filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredNews = filteredNews.slice(0, limit);
        
        setNews(filteredNews);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar noticias:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [entityType, entityId, limit]);

  if (isLoading) {
    return <div className="loading-spinner">Cargando noticias...</div>;
  }

  return (
    <div className="news-widget">
      {news.length > 0 ? (
        news.map(item => (
          <div key={item.id} className="news-item">
            <div className="news-date">{new Date(item.date).toLocaleDateString('es-ES')}</div>
            <div className="news-title">
              <a href={`/news/${item.id}`}>{item.title}</a>
            </div>
            <div className="news-source">{item.source}</div>
          </div>
        ))
      ) : (
        <div className="no-news">No hay noticias recientes disponibles.</div>
      )}
      
      <div className="view-all-news">
        <a href="/news">Ver todas las noticias</a>
      </div>
    </div>
  );
}
