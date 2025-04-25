'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';

export default function ApiRoutes() {
  // Esta función simula un servidor API que proporciona los datos simulados
  // En un entorno real, esto sería un servidor backend separado
  
  // Función para manejar la solicitud de sellos discográficos
  async function GET(req, { params }) {
    const { pathname } = new URL(req.url);
    
    // Determinar qué API se está solicitando
    if (pathname.includes('/api/labels')) {
      // Cargar datos de sellos discográficos
      const labelsData = await import('/home/ubuntu/music_dashboard/data/mock/labels.json');
      return new Response(JSON.stringify(labelsData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    else if (pathname.includes('/api/streaming')) {
      // Cargar datos de streaming
      const streamingData = await import('/home/ubuntu/music_dashboard/data/mock/streaming_data.json');
      return new Response(JSON.stringify(streamingData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    else if (pathname.includes('/api/artists')) {
      // Cargar datos de artistas
      const artistsData = await import('/home/ubuntu/music_dashboard/data/mock/artists_data.json');
      return new Response(JSON.stringify(artistsData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    else if (pathname.includes('/api/news')) {
      // Cargar datos de noticias
      const newsData = await import('/home/ubuntu/music_dashboard/data/mock/news_data.json');
      return new Response(JSON.stringify(newsData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Si no se encuentra la API solicitada
    return new Response(JSON.stringify({ error: 'API not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return { GET };
}
