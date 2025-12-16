# KAI Frontend - Next.js 14

## Overview

Modern, responsive frontend built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- **Chat Interface** - Real-time conversational shopping
- **Product Comparison** - Side-by-side platform comparison
- **Deals Page** - Curated daily deals
- **Profile Management** - User preferences and settings
- **Responsive Design** - Mobile-first approach

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Axios (API calls)
- Zustand (state management)

## Setup

### Installation

```bash
npm install
```

### Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js 14 app directory
│   ├── page.tsx      # Landing page
│   ├── chat/         # Chat interface
│   ├── deals/        # Deals page
│   ├── compare/      # Compare page
│   └── profile/      # Profile page
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── chat/         # Chat-specific components
│   ├── products/     # Product components
│   └── layout/       # Layout components
└── lib/              # Utilities
    ├── api.ts        # API client
    └── utils.ts      # Helper functions
```

## Pages

### Landing Page (`/`)
- Hero section
- Feature highlights
- Platform showcase
- How it works
- CTA sections

### Chat Page (`/chat`)
- Conversational interface
- Real-time messaging
- Product cards
- Suggestion chips

### Deals Page (`/deals`)
- Category filters
- Deal cards
- Discount highlights

### Compare Page (`/compare`)
- Search interface
- Comparison table
- Best options summary

### Profile Page (`/profile`)
- User preferences
- Platform selection
- Category preferences
- Notification settings

## Components

### UI Components
- `Button` - Styled button with variants
- `Card` - Container component
- `Input` - Form input
- `Badge` - Label/tag component

### Custom Components
- `ChatMessage` - Chat bubble
- `ProductCard` - Product display
- `SuggestionChips` - Quick actions
- `Navigation` - App navigation

## Styling

Using Tailwind CSS with custom configuration:

- Custom color palette
- Gradient utilities
- Animation utilities
- Responsive breakpoints

## API Integration

All API calls are centralized in `lib/api.ts`:

```typescript
import { chatAPI, searchAPI, dealsAPI } from '@/lib/api'

// Send message
const response = await chatAPI.sendMessage(message)

// Search products
const results = await searchAPI.searchProducts(query)

// Get deals
const deals = await dealsAPI.getTopDeals()
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

Build static export:

```bash
npm run build
```

Deploy `out/` directory to any static hosting.

## Performance

- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Lazy loading
- Optimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
