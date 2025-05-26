<div class="hero-icon" align="center">
<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>
<h1 align="center">
spacelane-3d-landing
</h1>
<h4 align="center">Showcases SaaS product with interactive 3D models, animations, and parallax effects.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Framework-React-61DAFB?logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/3D Engine-Three.js-333333?logo=three.js&logoColor=white" alt="Three.js">
<img src="https://img.shields.io/badge/Animation-GSAP-88CE00" alt="GSAP">
<img src="https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
</div>
<div class="badges" align="center">
<img src="https://img.shields.io/github/last-commit/coslynx/spacelane-3d-landing?style=flat-square&color=5D6D7E" alt="git-last-commit" />
<img src="https://img.shields.io/github/commit-activity/m/coslynx/spacelane-3d-landing?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/languages/top/coslynx/spacelane-3d-landing?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents

- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview

The spacelane-3d-landing MVP is an interactive 3D landing page for a SaaS product, built with React and Three.js. It features engaging 3D models, smooth animations, and parallax scrolling to showcase key features through immersive visualizations, targeting potential customers who appreciate innovative web experiences.

## 📦 Features

|    | Feature                | Description                                                                                                       |
|----|------------------------|-------------------------------------------------------------------------------------------------------------------|
| 🧊 | **3D Core**            | Manages the Three.js scene, rendering loop, and camera controls.                                               |
| 🎨 | **Theme System**       | Provides a consistent visual style across the landing page using React Context and custom shaders.                 |
| ✨ | **Animation System**   | Controls animations for 3D models and UI elements with GSAP and Framer Motion.                               |
| 🖼️ | **UI Layer**           | Provides UI elements for interacting with the 3D scene and navigating the landing page using React and Tailwind CSS. |
| 📝 | **Content Strategy**   | Defines the content hierarchy and key messages for the landing page.                                            |
| ⚡️ | **Performance**        | Monitors and optimizes performance, ensuring smooth frame rates and minimal memory usage.                         |

## 📂 Structure

```
├── node_modules/
├── public/
│   └── models/              # 3D models (.glb)
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── core/          # Three.js scene setup
│   │   │   ├── models/        # 3D model components
│   │   │   └── interactions/  # Interaction handlers
│   │   ├── ui/              # UI components
│   │   │   ├── common/        # Reusable UI elements
│   │   │   └── sections/      # Sections of the landing page
│   │   └── layout/          # Layout components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # React pages
│   ├── styles/            # CSS styles
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point for React application
│   └── vite-env.d.ts      # TypeScript type definitions
├── .eslintrc.cjs
├── .prettierrc.cjs
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
└── tailwind.config.js
```

## 💻 Installation

> [!WARNING]
> ### 🔧 Prerequisites
> - Node.js v18+
> - npm 6+

### 🚀 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/coslynx/spacelane-3d-landing.git
cd spacelane-3d-landing
```

2. Install dependencies:
```bash
npm install
```

## 🏗️ Usage

### 🏃‍♂️ Running the MVP

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
   - Open your browser and navigate to `http://localhost:5173`.

> [!TIP]
> ### ⚙️ Configuration
> - Use `.env` file to configure environment variables.
> - Customize theme settings in `src/context/ThemeContext.tsx`.

### 📚 Examples

- 3D Model Rendering:

```jsx
<ThreeScene>
  <ModelLoader path="/models/test.glb" />
</ThreeScene>
```

- Interactive Hero Section:

```jsx
<LandingHero
  modelPath="/models/test.glb"
  headline="Engage Your Audience"
  description="Create immersive experiences with interactive 3D visualizations."
  ctaText="Explore Now"
  onCtaClick={() => console.log('CTA Clicked')}
/>
```

## 🌐 Hosting

### 🚀 Deployment Instructions

#### Deploying to Netlify

1.  **Create a Netlify account:** Sign up at [Netlify](https://www.netlify.com/).
2.  **Install the Netlify CLI:**
    ```bash
    npm install -g netlify-cli
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
4.  **Deploy to Netlify:**
    ```bash
    netlify deploy --prod
    ```
    Follow the prompts to link your local project to your Netlify account and deploy.

### 🔑 Environment Variables

- `VITE_API_BASE_URL`: Base URL for API requests. Example: `https://api.example.com`
- `VITE_APP_TITLE`: Title of the application. Example: `3D Landing Page`
- `VITE_THREE_PATH`: Path to Three.js library. Example: `/three/`

> [!NOTE]
> Ensure all environment variables are set correctly in your hosting platform.

## 📄 License & Attribution

### 📄 License
This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.

### 🤖 AI-Generated MVP
This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).

No human was directly involved in the coding process of the repository: spacelane-3d-landing

### 📞 Contact
For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
- Website: [CosLynx.com](https://coslynx.com)
- Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
<h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
<em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>