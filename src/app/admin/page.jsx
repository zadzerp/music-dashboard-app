'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';

export default function AdminPage() {
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [updateConfig, setUpdateConfig] = useState({
    frequency: 'daily',
    time: '00:00',
    sources: {
      spotify: true,
      youtube: true,
      apple: true
    },
    notifications: {
      email: false,
      dashboard: true
    }
  });
  
  const handleFrequencyChange = (e) => {
    setUpdateConfig({
      ...updateConfig,
      frequency: e.target.value
    });
  };
  
  const handleTimeChange = (e) => {
    setUpdateConfig({
      ...updateConfig,
      time: e.target.value
    });
  };
  
  const handleSourceToggle = (source) => {
    setUpdateConfig({
      ...updateConfig,
      sources: {
        ...updateConfig.sources,
        [source]: !updateConfig.sources[source]
      }
    });
  };
  
  const handleNotificationToggle = (type) => {
    setUpdateConfig({
      ...updateConfig,
      notifications: {
        ...updateConfig.notifications,
        [type]: !updateConfig.notifications[type]
      }
    });
  };
  
  const handleSaveConfig = () => {
    // En un entorno real, esto enviaría la configuración al servidor
    alert('Configuración guardada correctamente');
  };
  
  return (
    <div className="admin-page">
      <h1 className="page-title">Administración del Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card title="Configuración de Actualización Automática">
            <div className="config-form">
              <div className="form-group">
                <label htmlFor="frequency">Frecuencia de actualización:</label>
                <select 
                  id="frequency" 
                  value={updateConfig.frequency}
                  onChange={handleFrequencyChange}
                  className="form-select"
                >
                  <option value="hourly">Cada hora</option>
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="update-time">Hora de actualización:</label>
                <input 
                  id="update-time" 
                  type="time" 
                  value={updateConfig.time}
                  onChange={handleTimeChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Fuentes de datos:</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="spotify-source"
                      checked={updateConfig.sources.spotify}
                      onChange={() => handleSourceToggle('spotify')}
                    />
                    <label htmlFor="spotify-source">Spotify</label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="youtube-source"
                      checked={updateConfig.sources.youtube}
                      onChange={() => handleSourceToggle('youtube')}
                    />
                    <label htmlFor="youtube-source">YouTube</label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="apple-source"
                      checked={updateConfig.sources.apple}
                      onChange={() => handleSourceToggle('apple')}
                    />
                    <label htmlFor="apple-source">Apple Music</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Notificaciones:</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="email-notification"
                      checked={updateConfig.notifications.email}
                      onChange={() => handleNotificationToggle('email')}
                    />
                    <label htmlFor="email-notification">Correo electrónico</label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="dashboard-notification"
                      checked={updateConfig.notifications.dashboard}
                      onChange={() => handleNotificationToggle('dashboard')}
                    />
                    <label htmlFor="dashboard-notification">Dashboard</label>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="save-button"
                  onClick={handleSaveConfig}
                >
                  Guardar configuración
                </button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="dashboard-column">
          <Card title="Estado del Sistema">
            <div className="system-status">
              <div className="status-item">
                <span className="status-label">Estado actual:</span>
                <span className="status-value online">En línea</span>
              </div>
              <div className="status-item">
                <span className="status-label">Última actualización:</span>
                <span className="status-value">{new Date().toLocaleString('es-ES')}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Próxima actualización:</span>
                <span className="status-value">
                  {(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    return tomorrow.toLocaleString('es-ES');
                  })()}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Versión del sistema:</span>
                <span className="status-value">1.0.0</span>
              </div>
            </div>
            
            <div className="system-actions">
              <button className="action-button">Actualizar ahora</button>
              <button className="action-button">Reiniciar sistema</button>
              <button className="action-button">Limpiar caché</button>
            </div>
          </Card>
          
          <Card title="Servicio de Actualización Automática">
            <iframe 
              src="/auto-update-service" 
              className="service-frame"
              style={{ width: '100%', height: '300px', border: 'none' }}
            ></iframe>
          </Card>
        </div>
      </div>
    </div>
  );
}
