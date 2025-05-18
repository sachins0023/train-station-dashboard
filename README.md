# Train Station Dashboard

A modern web application for managing and displaying train arrivals and departures at railway stations with limited platforms. Built with React, TypeScript, and Vite, this dashboard provides a clean and intuitive interface for station management.

## Features

- Real-time train arrival and departure tracking
- Platform management for limited station capacity
- Modern, responsive UI built with React and Tailwind CSS
- Type-safe development with TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/sachins0023/train-station-dashboard.git
cd train-station-dashboard
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run ESLint to check code quality
- `pnpm deploy` - Build and deploy to GitHub Pages

## Building for Production

To create a production build:

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```bash
pnpm preview
```

## Deployment

The application is configured for deployment to GitHub Pages. To deploy:

```bash
pnpm deploy
```

The live application is available at: [https://sachins0023.github.io/train-station-dashboard](https://sachins0023.github.io/train-station-dashboard)

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- ESLint
- GitHub Pages (Deployment)
