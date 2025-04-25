import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Market Share Analysis - Tracking de Streams Musicales',
  description: 'Monitoreo de streams de Spotify para Sony, Universal y Warner Music',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="header-logo">
              <Image 
                src="/images/wmg_logo.png" 
                alt="Warner Music Group" 
                width={120} 
                height={40} 
              />
              <span className="header-title">Market Share Analysis</span>
            </div>
            <div className="header-controls">
              <button className="mobile-menu-toggle">
                <span></span>
              </button>
            </div>
          </header>
          
          <aside className="dashboard-sidebar">
            <div className="filter-group">
              <h3 className="filter-title">Período de Tiempo</h3>
              <div className="time-filter">
                <div className="time-filter-option active">1d</div>
                <div className="time-filter-option">5d</div>
                <div className="time-filter-option">1m</div>
                <div className="time-filter-option">3m</div>
                <div className="time-filter-option">1a</div>
                <div className="time-filter-option">Máx.</div>
              </div>
            </div>
            
            <div className="filter-group">
              <h3 className="filter-title">Sellos Discográficos</h3>
              <div className="filter-option">
                <input type="checkbox" id="sony" name="sony" checked />
                <label htmlFor="sony">Sony Music</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="universal" name="universal" checked />
                <label htmlFor="universal">Universal Music</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="warner" name="warner" checked />
                <label htmlFor="warner">Warner Music</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="independent" name="independent" checked />
                <label htmlFor="independent">Independientes</label>
              </div>
            </div>
            
            <div className="filter-group">
              <h3 className="filter-title">Plataformas</h3>
              <div className="filter-option">
                <input type="checkbox" id="spotify" name="spotify" checked />
                <label htmlFor="spotify">Spotify</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="youtube" name="youtube" checked />
                <label htmlFor="youtube">YouTube</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="apple" name="apple" checked />
                <label htmlFor="apple">Apple Music</label>
              </div>
            </div>
          </aside>
          
          <main className="dashboard-main">
            {children}
          </main>
          
          <footer className="dashboard-footer">
            <div>Última actualización: {new Date().toLocaleString('es-ES')} | Market Share Analysis © 2025</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
