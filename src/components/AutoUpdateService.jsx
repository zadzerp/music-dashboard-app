'use client';

import React, { useState, useEffect } from 'react';

export default function AutoUpdateService() {
  // Esta función simula un servicio de actualización automática
  // En un entorno real, esto sería un servicio backend separado
  
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    // Simular carga inicial de estado
    const now = new Date();
    setLastUpdate(now);
    
    // Calcular próxima actualización (mañana a la misma hora)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Establecer a medianoche
    setNextUpdate(tomorrow);
    
    // Agregar registro inicial
    addLog('Servicio de actualización automática iniciado');
    addLog('Datos iniciales cargados correctamente');
    
    // Simular actualización cada minuto (solo para demostración)
    // En producción, esto sería un trabajo programado diario
    const interval = setInterval(() => {
      simulateUpdate();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const simulateUpdate = () => {
    setStatus('updating');
    addLog('Iniciando actualización de datos...');
    
    // Simular proceso de actualización
    setTimeout(() => {
      addLog('Obteniendo nuevos datos de streaming...');
    }, 1000);
    
    setTimeout(() => {
      addLog('Procesando datos de sellos discográficos...');
    }, 2000);
    
    setTimeout(() => {
      addLog('Actualizando información de artistas...');
    }, 3000);
    
    setTimeout(() => {
      addLog('Recopilando noticias recientes...');
    }, 4000);
    
    // Finalizar actualización después de 5 segundos
    setTimeout(() => {
      const now = new Date();
      setLastUpdate(now);
      
      // Calcular próxima actualización (mañana a la misma hora)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Establecer a medianoche
      setNextUpdate(tomorrow);
      
      addLog('Actualización completada correctamente');
      setStatus('idle');
    }, 5000);
  };
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    setLogs(prevLogs => [
      { timestamp, message },
      ...prevLogs.slice(0, 19) // Mantener solo los últimos 20 registros
    ]);
  };
  
  const formatDateTime = (date) => {
    if (!date) return 'No disponible';
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const handleManualUpdate = () => {
    if (status === 'updating') return;
    simulateUpdate();
  };
  
  return (
    <div className="auto-update-service">
      <div className="service-status">
        <div className="status-item">
          <span className="status-label">Estado:</span>
          <span className={`status-value ${status}`}>
            {status === 'idle' ? 'Inactivo' : 'Actualizando...'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Última actualización:</span>
          <span className="status-value">{formatDateTime(lastUpdate)}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Próxima actualización:</span>
          <span className="status-value">{formatDateTime(nextUpdate)}</span>
        </div>
      </div>
      
      <div className="service-controls">
        <button 
          className="update-button"
          onClick={handleManualUpdate}
          disabled={status === 'updating'}
        >
          Actualizar ahora
        </button>
      </div>
      
      <div className="service-logs">
        <h3>Registro de actividad</h3>
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              <span className="log-timestamp">{log.timestamp}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
