# 117 — Del Pensamiento a la Realidad

**117** es un ecosistema interactivo digital donde convergen la ingeniería, el arte, la tecnología y el propósito. Diseñado y desarrollado como la plataforma central del estudio de **Junior Nieves**, este sitio web combina interfaces inmersivas en 3D, simulaciones de telemetría futurista y navegación fluida para transformar ideas en experiencias de software y diseño reales.

---

## 🌌 Características Clave

* **Manifiesto Generativo 3D**: Un fondo interactivo compuesto por un campo de partículas tridimensionales cilíndricas que reacciona de forma dinámica a la atracción del cursor del ratón y aumenta de velocidad (efecto warp-speed) al hacer scroll.
* **Universo 117 (Consola de Telemetría)**: Un panel táctico y terminal interactiva de telemetría en tiempo real que detalla el estado, coordenadas vectoriales y métricas de rendimiento de los diferentes núcleos del ecosistema:
  * **ATLAS.CORE** // Ecosistema inteligente y agéntico para desarrollo autónomo de software.
  * **MUSIC.WAVE** // Paisajes sonoros procedurales sintonizados a 432Hz para inducir estados de hiperenfoque.
  * **BOOKS.TEXT** // Registro y base de conocimientos de escritos filosóficos y literatura futurista.
  * **STUDIO.AV** // Producción audiovisual y renderizado cinematográfico en tiempo real.
  * **LABS.R&D** // Laboratorio experimental para interfaces neuronales y hardware biomecatrónico.
* **Experiencia Inmersiva de Navegación**: Integración de scroll suave mediante **Lenis** y micro-animaciones HUD fluidas con **Framer Motion**.

---

## 🛠️ Stack Tecnológico

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router) con TypeScript
* **Diseño y Estilos**: Tailwind CSS v4 (mediante PostCSS) y CSS Modules
* **Gráficos 3D**:
  * [Three.js](https://threejs.org/) (Motor 3D base)
  * [React Three Fiber](https://r3f.docs.pmnd.rs/) (Integración React 3D)
  * [@react-three/drei](https://github.com/pmndrs/drei) (Componentes y utilidades R3F)
* **Animación & Física de Scroll**:
  * [Framer Motion](https://www.framer.com/motion/) (Efectos e interacciones de interfaz)
  * [Lenis](https://lenis.darkroom.engineering/) (Suavizado de scroll vertical)

---

## 📁 Estructura del Proyecto

```bash
├── public/                  # Modelos 3D (.glb), assets de planetas e imágenes
├── src/
│   ├── app/                 # Configuración de rutas de Next.js, layout y estilos globales
│   │   ├── globals.css      # Sistema de diseño de variables CSS
│   │   ├── layout.tsx       # Estructura del encabezado y la página
│   │   └── page.tsx         # Punto de entrada de la Landing Page
│   └── components/          # Componentes interactivos modulares
│       ├── Hero.tsx         # Cabecera principal y fondo 3D Spline
│       ├── Manifesto.tsx    # Manifiesto interactivo con Canvas 3D de partículas
│       ├── Founder.tsx      # Presentación del fundador con efecto de radar
│       ├── Universe.tsx     # Consola de telemetría y logs interactiva
│       ├── Projects.tsx     # Galería de proyectos y desarrollos
│       ├── Philosophy.tsx   # Filosofía y principios de diseño
│       ├── Vision.tsx       # Visión a futuro del ecosistema
│       ├── Contact.tsx      # Formulario y canales de contacto
│       └── SmoothScroll.tsx # Inicializador del scroll suave de Lenis
└── package.json             # Dependencias y scripts del proyecto
```

---

## 🚀 Instalación y Desarrollo Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/117-web.git
cd 117-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

El sitio estará disponible en: **[http://localhost:3000](http://localhost:3000)**

---

## 👤 Creador
* **Junior Nieves** - *Fundador de 117* - [Junior Nieves](https://github.com/TU-USUARIO)
