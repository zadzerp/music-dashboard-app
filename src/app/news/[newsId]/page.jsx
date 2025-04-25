'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui';

export default function NewsDetail({ params }) {
  const { newsId } = params;
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const newsResponse = await fetch('/api/news');
        const newsData = await newsResponse.json();

        // Encontrar la noticia seleccionada
        const selectedNews = newsData.news.find(n => n.id === newsId);
        setNews(selectedNews);
        
        if (selectedNews) {
          // Buscar noticias relacionadas
          // Si es una noticia de sello, buscar otras noticias del mismo sello
          // Si es una noticia de artista, buscar otras noticias del mismo artista
          const related = newsData.news.filter(n => 
            n.id !== newsId && 
            n.related_entity.type === selectedNews.related_entity.type &&
            n.related_entity.id === selectedNews.related_entity.id
          );
          
          setRelatedNews(related);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    if (newsId) {
      fetchData();
    }
  }, [newsId]);

  if (isLoading || !news) {
    return <div className="loading">Cargando noticia...</div>;
  }

  // Determinar la ruta de navegación según el tipo de entidad relacionada
  const getBreadcrumbPath = () => {
    const entity = news.related_entity;
    
    if (entity.type === 'label') {
      return (
        <>
          <a href="/">Dashboard</a> &gt; 
          <a href={`/label/${entity.id}`}>{entity.name}</a> &gt; 
          Noticia
        </>
      );
    } else if (entity.type === 'artist') {
      return (
        <>
          <a href="/">Dashboard</a> &gt; 
          <a href={`/label/${entity.label_id}`}>{entity.label_name}</a> &gt; 
          <a href={`/artist/${entity.id}`}>{entity.name}</a> &gt; 
          Noticia
        </>
      );
    } else {
      return (
        <>
          <a href="/">Dashboard</a> &gt; Noticia
        </>
      );
    }
  };

  return (
    <div>
      <div className="breadcrumb">
        {getBreadcrumbPath()}
      </div>
      
      <div className="news-detail">
        <h1 className="page-title">{news.title}</h1>
        
        <div className="news-meta">
          <span className="news-date">{new Date(news.date).toLocaleDateString('es-ES')}</span>
          <span className="news-source">{news.source}</span>
        </div>
        
        <div className="news-content">
          <p>{news.content}</p>
        </div>
        
        {news.url && (
          <div className="news-link">
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              Leer artículo completo en la fuente original
            </a>
          </div>
        )}
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card title="Entidad Relacionada">
            <div className="related-entity">
              <div className="entity-type">
                {news.related_entity.type === 'label' ? 'Sello Discográfico' : 'Artista'}
              </div>
              <div className="entity-name">
                {news.related_entity.name}
              </div>
              <div className="entity-link">
                <a href={
                  news.related_entity.type === 'label' 
                    ? `/label/${news.related_entity.id}` 
                    : `/artist/${news.related_entity.id}`
                }>
                  Ver detalles de {news.related_entity.type === 'label' ? 'sello' : 'artista'}
                </a>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="dashboard-column">
          <Card title="Noticias Relacionadas">
            <div className="news-container">
              {relatedNews.length > 0 ? (
                relatedNews.map(item => (
                  <div key={item.id} className="news-item">
                    <div className="news-date">{new Date(item.date).toLocaleDateString('es-ES')}</div>
                    <div className="news-title">
                      <a href={`/news/${item.id}`}>{item.title}</a>
                    </div>
                    <div className="news-source">{item.source}</div>
                  </div>
                ))
              ) : (
                <div className="no-news">No hay noticias relacionadas disponibles.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
