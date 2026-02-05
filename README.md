
# AI Resume Analyzer

**AI Resume Analyzer** es una aplicación web full-stack construida con React, React Router, TypeScript y TailwindCSS. Permite a los usuarios subir su currículum, analizarlo con inteligencia artificial (GPT-4o vía Puter), obtener feedback personalizado y visualizar resultados de manera interactiva.

---

## Características principales

- **Análisis de CV con IA:** Sube tu PDF y recibe feedback detallado, puntuación ATS y sugerencias de mejora.
- **Comparación con vacantes:** El análisis se adapta a la descripción del puesto y empresa que elijas.
- **Visualización interactiva:** Muestra resultados con gráficos, badges y secciones detalladas.
- **Gestión de archivos:** Sube, almacena y visualiza tus currículums y resultados previos.
- **Autenticación:** Acceso seguro y gestión de sesiones.
- **UI moderna:** TailwindCSS, animaciones y diseño responsivo.
- **Despliegue listo para producción:** Incluye Dockerfile y scripts para despliegue en cualquier plataforma.

---

## Estructura del proyecto

```
ai-resume-analyzer/
├── app/
│   ├── components/         # Componentes UI: Summary, Detail, ATS, ScoreBadge, ScoreGauge, etc.
│   ├── lib/                # Lógica de integración con Puter, utilidades, conversión PDF a imagen
│   ├── routes/             # Rutas principales: home, upload, resume, auth, etc.
│   ├── constants/          # Constantes y prompts para IA
│   └── ...                 # Otros archivos de la app
├── public/
│   ├── images/             # Imágenes y fondos
│   ├── icons/              # Iconos SVG
│   └── pdf.worker.min.mjs  # Worker de PDF.js (versión sincronizada con pdfjs-dist)
├── types/                  # Tipos TypeScript globales
├── Dockerfile              # Configuración para despliegue en Docker
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite + Tailwind + React Router
└── README.md               # Este archivo
```

---

## Instalación y uso

### 1. Instalación de dependencias

```bash
npm install
```

### 2. Desarrollo local

```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 3. Build de producción

```bash
npm run build
```

### 4. Despliegue con Docker

```bash
docker build -t ai-resume-analyzer .
docker run -p 3000:3000 ai-resume-analyzer
```

---

## Integración con Puter e IA

- **Puter** es la capa de backend que gestiona autenticación, almacenamiento de archivos, base de datos clave-valor y acceso a modelos de IA.
- El análisis de CV se realiza enviando el PDF y un prompt personalizado (según la vacante) al modelo GPT-4o a través de Puter.
- El feedback de la IA se almacena y se muestra al usuario con visualizaciones interactivas.

---

## Principales dependencias

- **React 19** y **React Router 7**: UI y routing.
- **TypeScript**: Tipado estático.
- **TailwindCSS**: Estilos y utilidades.
- **zustand**: Manejo de estado global.
- **pdfjs-dist**: Conversión y renderizado de PDFs.
- **Puter SDK**: Integración con servicios de Puter (auth, fs, kv, ai).

---

## Personalización y estilos

- Puedes modificar los estilos en `app.css` o directamente en los componentes con clases Tailwind.
- Las imágenes de fondo y los iconos están en `public/images` y `public/icons`.

---

## Notas y buenas prácticas

- Asegúrate de que la versión de `pdf.worker.min.mjs` coincida con la de `pdfjs-dist`.
- El archivo `.env` (si lo usas) debe contener las claves necesarias para Puter.
- Si cambias rutas o estructuras, actualiza los imports relativos o los alias en `tsconfig.json` y `vite.config.ts`.

---

## Licencia

MIT
