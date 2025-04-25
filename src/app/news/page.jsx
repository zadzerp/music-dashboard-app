'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchData = async () => {
      try {
        // Cargar datos simulados
        const newsResponse = await fetch('/api/news');
        const labelsResponse = await fetch('/api/labels');
        
        const newsData = await newsResponse.json();
        const labelsData = await labelsResponse.json();
        
        setNews(newsData.news);
        setFilteredNews(newsData.news);
        setLabels(labelsData.labels);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar noticias según los criterios seleccionados
    let filtered = [...news];
    
    // Filtrar por sello
    if (selectedLabel !== 'all') {
      filtered = filtered.filter(item => {
        if (item.related_entity.type === 'label') {
          return item.related_entity.id === selectedLabel;
        } else if (item.related_entity.type === 'artist') {
          return item.related_entity.label_id === selectedLabel;
        }
        return false;
      });
    }
    
    // Filtrar por tipo de entidad
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.related_entity.type === selectedType);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.content.toLowerCase().includes(term) ||
        item.related_entity.name.toLowerCase().includes(term)
      );
    }
    
    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredNews(filtered);
  }, [news, selectedLabel, selectedType, searchTerm]);

  const handleLabelChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Cargando noticias...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Noticias de la Industria Musical</h1>
      
      <div className="news-filters">
        <div className="filter-group">
          <label htmlFor="label-filter">Sello Discográfico:</label>
          <select 
            id="label-filter" 
            value={selectedLabel} 
            onChange={handleLabelChange}
            className="filter-select"
          >
            <option value="all">Todos los sellos</option>
            {labels.map(label => (
              <option key={label.id} value={label.id}>{label.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Tipo:</label>
          <select 
            id="type-filter" 
            value={selectedType} 
            onChange={handleTypeChange}
            className="filter-select"
          >
            <option value="all">Todos los tipos</option>
            <option value="label">Sellos Discográficos</option>
            <option value="artist">Artistas</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="search-filter">Buscar:</label>
          <input 
            id="search-filter" 
            type="text" 
            value={searchTerm} 
            onChange={handleSearchChange}
            placeholder="Buscar en noticias..."
            className="filter-input"
          />
        </div>
      </div>
      
      <div className="news-list">
        {filteredNews.length > 0 ? (
          filteredNews.map(item => (
            <Card key={item.id}>
              <div className="news-item-large">
                <div className="news-header">
                  <h2 className="news-title">
                    <a href={`/news/${item.id}`}>{item.title}</a>
                  </h2>
                  <div className="news-meta">
                    <span className="news-date">{new Date(item.date).toLocaleDateString('es-ES')}</span>
                    <span className="news-source">{item.source}</span>
                  </div>
                </div>
                
                <div className="news-content-preview">
                  {item.content.substring(0, 200)}...
                </div>
                
                <div className="news-footer">
                  <div className="related-entity">
                    <span className="entity-type">
                      {item.related_entity.type === 'label' ? 'Sello: ' : 'Artista: '}
                    </span>
                    <span className="entity-name">
                      {item.related_entity.name}
                    </span>
                  </div>
                  
                  <a href={`/news/${item.id}`} className="read-more">
                    Leer más
                  </a>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="no-results">
            No se encontraron noticias que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
