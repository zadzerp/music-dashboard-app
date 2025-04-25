# README.md - Market Share Analysis Dashboard

## Descripción
Dashboard de análisis de cuota de mercado para el seguimiento de streams musicales de los tres grandes sellos discográficos (Sony, Universal y Warner) y sellos independientes. Diseñado con un estilo visual inspirado en Warner Music Group.

## Características
- Visualización de streams por sello discográfico con gráficos de línea
- Análisis detallado por sello, artista y track
- Sistema de noticias relacionadas con la industria musical
- Actualización automática diaria configurable
- Diseño responsive adaptado a diferentes dispositivos

## Tecnologías utilizadas
- Next.js para el frontend
- Recharts para visualizaciones gráficas
- Datos simulados para demostración

## Instalación local

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/market-share-analysis.git
cd market-share-analysis
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Despliegue en GitHub Pages

Este proyecto está configurado para ser desplegado automáticamente en GitHub Pages mediante GitHub Actions.

1. Crear un repositorio en GitHub
2. Subir el código al repositorio:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/market-share-analysis.git
git push -u origin main
```

3. El flujo de trabajo de GitHub Actions se encargará del despliegue automáticamente

## Estructura del proyecto
- `/src/app`: Páginas y componentes principales
- `/src/components`: Componentes reutilizables
- `/data/mock`: Datos simulados para demostración
- `/public/images`: Imágenes y recursos estáticos

## Personalización
El dashboard está diseñado con los colores y estilo de Warner Music Group, pero puede ser personalizado modificando los archivos CSS y componentes según sea necesario.

## Licencia
Este proyecto es para uso exclusivo del cliente y no está disponible para distribución pública.
