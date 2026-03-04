# 🌱 AgriLink (AgriShare)

> Built for the future of Indian agriculture.

AgriLink is a comprehensive, modern web platform designed to empower farmers and streamline agricultural processes. From land monitoring and equipment rentals to AI-powered crop advisory and multilingual support, AgriLink provides all the essential tools for modern farming in one accessible place.

## 🚀 Features

- **🗺️ Land Monitoring:** Track and manage farmlands with interactive maps.
- **🚜 Equipment Rental:** Browse, rent, and manage agricultural machinery.
- **👨‍🌾 Hire Workers:** Seamlessly connect with skilled agricultural laborers.
- **🚚 Transport Services:** Arrange logistics and transportation for produce and supplies.
- **🌾 AI Crop Advisor:** Get intelligent insights and recommendations for crop management.
- **📊 Market Prices & Govt Schemes:** Stay updated on current market rates and relevant government initiatives.
- **📅 Crop Calendar:** Plan and track planting, treating, and harvesting schedules.
- **💬 Messaging System:** Communicate directly within the platform.
- **🌐 Multilingual Support (i18n):** Accessible to farmers in multiple languages.
- **🎙️ Voice Assistant:** Integrated floating voice assistant for hands-free queries and navigation.

## 🛠️ Technology Stack

This project is built using modern web development technologies to ensure high performance, accessibility, and a great developer experience.

- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Components:** Radix UI Primitives (Accessible, unstyled components)
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or newer recommended) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adithyayanamalamanda/AgriShare.git
   cd AgriShare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── api/            # API client configurations (e.g., base44Client)
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components (VoiceAssistant, etc.)
├── i18n/           # Internationalization configurations and contexts
├── lib/            # Utility functions (e.g., cn utility)
├── pages/          # Application routes/pages (Home, Lands, Equipment, etc.)
├── App.jsx         # Main application component and routing setup
├── Layout.jsx      # Global layout including Navbar and Footer
├── index.css       # Global styles and Tailwind directives
└── main.jsx        # Application entry point
```

## 📄 License

&copy; AgriLink. All rights reserved.
