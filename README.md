# HABA | حَبّة — AI-Powered Artisan Catalog & Management System

<div align="center">

```
           ●
          ╱
       ●──●
           ╲
            ●
```

### **حَبّة ورا حَبّة، حكاية بتتعمل.**
*Made bead by bead.*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  A bespoke, editorial e-commerce catalog and intelligent inventory portal built for <b>HABA (حَبّة)</b> — a luxury artisan handmade accessories brand specializing in beaded bags, necklaces, and handcrafted jewelry.
</p>

</div>

---

## 📖 Overview

**HABA | حَبّة** redefines traditional e-commerce by eliminating cumbersome cart-and-checkout overhead in favor of an **intimate, high-conversion WhatsApp direct-to-artisan purchasing flow**. 

Designed for both the discerning customer and the non-technical artisan, the platform combines a **high-fashion editorial storefront** with an **AI-powered product creation wizard** that automates photography enhancement, storytelling copywriting, and SEO generation using **Google Gemini 1.5 Flash**.

---

## ✨ Key Features

### 🛍️ Customer Experience (Storefront)
* **Editorial Aesthetics:** Built on HABA's signature warm-luxury visual identity (*Cormorant Garamond* & *DM Sans*).
* **Catalog Exploration:** Real-time search, category filtering, price sorting, and responsive pagination.
* **Product Showcase:** High-resolution multi-angle image galleries, artisan materials breakdown, and stock indicators.
* **1-Click WhatsApp Ordering:** Direct checkout via WhatsApp with pre-composed messages referencing product title, price, SKU, and direct link.
* **Fully Responsive:** Optimized for mobile (Instagram/TikTok direct traffic), tablet, and desktop viewports.

### ⚡ Artisan Admin Portal
* **Protected Dashboard:** Secure JWT-based access with catalog health metrics (published count, categories, drafts).
* **Category Architecture:** Add, edit, reorder, and remove product categories with automatic slug generation.
* **Inventory Control:** Complete CRUD with draft/published state toggling and soft confirmation checks.
* **Brand Customizer:** Dynamically manage brand colors, WhatsApp numbers, and AI photography prompts from `/admin/settings`.

### 🔮 6-Step AI Creation Wizard
1. **Basic Information:** Product name, category classification, pricing, and materials.
2. **Media Upload:** Drag-and-drop Cloudinary integration with automatic image compression and fallback encoding.
3. **AI Photo Enhancement:** Studio background styling with strict product preservation rules to ensure beads, colors, and textures remain 100% authentic.
4. **Google Gemini Copywriting:** Generates brand-voice descriptions, emotional storytelling, highlights, and SEO tags.
5. **Review & Fine-Tune:** Inline editable review step before committing changes.
6. **Publish:** Instant catalog deployment.

---

## 🎨 Brand Identity & Design System

| Token | Color Name | Hex Code | Usage |
|---|---|---|---|
| `--color-ivory` | **HABA Ivory** | `#F7F1E8` | Primary background, clean packaging tone |
| `--color-plum` | **HABA Plum** | `#542A3A` | Primary brand accent, headings, CTA buttons |
| `--color-rose` | **Dusty Rose** | `#C98B91` | Secondary accents, hover states, badges |
| `--color-peach` | **Soft Peach** | `#E8C7B8` | Card backgrounds, subtle dividers |
| `--color-gold` | **Champagne Gold** | `#C5A56A` | Premium collection markers, subtle highlights |
| `--color-charcoal` | **Warm Charcoal** | `#292525` | Editorial body text, dark sidebar surfaces |

### Typography
* **Display / Headings:** `Cormorant Garamond` — Classical serif imparting editorial elegance and craftsmanship.
* **Body / UI:** `DM Sans` — Clean, modern sans-serif delivering optimal legibility on mobile screens.

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                  │
├────────────────────────────┬────────────────────────────┤
│   Frontend (SPA)           │   Backend (Serverless API) │
│   React 19 + Vite          │   Express 5 + Node.js      │
│   Tailwind CSS v4          │   Vercel Serverless func   │
└─────────────┬──────────────┴─────────────┬──────────────┘
              │                            │
              ▼                            ▼
     [ Browser / Client ]         [ MongoDB Atlas Cloud ]
              │                            │
              ├────── Cloudinary CDN ──────┤ (Media Storage)
              │                            │
              └──── Google Gemini API ─────┘ (AI Text & Copy)
```

---

## 📁 Repository Structure

```
Handmade/
├── backend/                      # Express API
│   ├── api/                      # Vercel serverless entry point (index.js)
│   ├── src/
│   │   ├── common/               # Middleware (auth, error, upload), utils, errors
│   │   ├── config/               # DB connection, CORS, Cloudinary, env loader
│   │   ├── modules/
│   │   │   ├── ai/               # Gemini AI & Image processing services
│   │   │   ├── auth/             # Admin login & JWT controller
│   │   │   ├── categories/       # Category models & routes
│   │   │   ├── media/            # Image upload & deletion routes
│   │   │   ├── products/         # Product schemas, services & controllers
│   │   │   ├── settings/         # BrandSettings singleton
│   │   │   └── users/            # Admin user management
│   │   └── seeds/                # Idempotent database seed script
│   ├── vercel.json               # Backend Vercel serverless configuration
│   └── package.json
│
├── frontend/                     # React 19 Client
│   ├── src/
│   │   ├── components/           # UI components (common, layout, product, wizard)
│   │   ├── context/              # AuthContext & Session management
│   │   ├── pages/                # Home, Shop, ProductDetail, Admin Pages
│   │   ├── services/             # Axios API client & endpoints
│   │   ├── styles/               # Tailwind v4 theme & typography tokens
│   │   └── utils/                # WhatsApp link generator & formatters
│   ├── vercel.json               # Frontend routing configuration (SPA rewrites)
│   └── package.json
│
├── .gitignore                    # Git tracking rules (protects private keys)
└── README.md                     # Project documentation
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

```ini
# Server
NODE_ENV=production
PORT=5000

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.pepwy4d.mongodb.net/handmade-store?retryWrites=true&w=majority

# Security & Tokens
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Provider (Google Gemini)
AI_API_KEY=your-google-ai-studio-key

# Business Defaults
WHATSAPP_NUMBER=+201234567890
FRONTEND_URL=https://your-frontend-project.vercel.app
```

### Frontend Configuration (`frontend/.env`)

```ini
# Base API URL
VITE_API_URL=https://your-backend-project.vercel.app/api
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local mongod instance or free MongoDB Atlas URI
* **Cloudinary Account**: Free tier cloud name & API credentials
* **Google AI Studio Key**: Gemini API key

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/HazemO7/Handmade.git
cd Handmade

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Seeding

Populate your database with default brand settings, categories, products, and admin credentials:

```bash
cd backend
npm run seed
# Or seed Atlas directly:
node src/seeds/seed.js "mongodb+srv://<user>:<pass>@cluster0.../handmade-store"
```

* **Default Admin Email:** `admin@handmade.com`
* **Default Admin Password:** `Password123!`

### 4. Running the App

```bash
# Start backend API (Terminal 1)
cd backend
npm run dev

# Start frontend Vite dev server (Terminal 2)
cd frontend
npm run dev
```

Visit `http://localhost:5173` to explore the storefront.

---

## 🌐 Deployment Guide (Vercel)

Both frontend and backend are pre-configured to deploy independently on **Vercel**:

### Backend Deployment
1. Create a new Project on Vercel pointing to the repository.
2. Set **Root Directory** to `backend`.
3. Add Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `AI_API_KEY`, `FRONTEND_URL`).
4. Ensure **Network Access** on MongoDB Atlas includes `0.0.0.0/0` (Allow from anywhere).
5. Deploy.

### Frontend Deployment
1. Create a new Project on Vercel pointing to the repository.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   ```text
   VITE_API_URL=https://<your-backend-url>.vercel.app/api
   ```
4. Deploy.

---

## 🧪 Testing Suite

Run automated unit and component test suites:

```bash
# Frontend Vitest Suite (13 tests across 5 suites)
npm test --prefix frontend -- --run

# Backend Unit Tests (Jest)
npm test --prefix backend -- src/__tests__/unit
```

---

## 🔒 Security Hardening

* **Helmet:** Enforces secure HTTP response headers.
* **Rate Limiting:** Protects API endpoints against DDoS and brute-force auth attempts.
* **Sanitization:** `express-mongo-sanitize` defends against NoSQL injection vectors.
* **Parameter Pollution Protection:** `hpp` protects query string tampering.
* **CORS Whitelisting:** Dynamic origin checking restricts external access to authorized frontend domains.

---

## 📜 License

This project is licensed under the **ISC License**.

<div align="center">
  <sub>Crafted with passion for <b>HABA | حَبّة</b>. All rights reserved.</sub>
</div>
