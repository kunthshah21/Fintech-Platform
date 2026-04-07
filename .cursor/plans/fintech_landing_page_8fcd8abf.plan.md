---
name: Fintech Landing Page
overview: Build a modern, conversion-focused landing page for an alternative investments fintech platform using React (Vite) + Tailwind CSS, featuring a hero section with abstract background, onboarding CTA, and marketing copy highlighting AI-powered investment guidance.
todos:
  - id: scaffold
    content: Scaffold Vite + React project, install dependencies (tailwindcss, react-router-dom, lucide-react, framer-motion)
    status: completed
  - id: global-styles
    content: Configure Tailwind, set up global styles (fonts, colors), index.css
    status: completed
  - id: navbar
    content: Build Navbar component with logo, links, and Get Started button
    status: completed
  - id: hero
    content: Build Hero section with abstract CSS background, headline, subheadline, CTA button, trust indicators
    status: completed
  - id: features
    content: Build Features section with investment type cards (invoice discounting, P2P, private credit, etc.)
    status: completed
  - id: ai-chat
    content: Build AI Chat / Smart Advisor section with mock chat UI and marketing copy
    status: completed
  - id: how-it-works
    content: Build How It Works 3-step section
    status: completed
  - id: cta-footer
    content: Build final CTA section and Footer
    status: completed
  - id: routing
    content: Set up React Router with Landing page and placeholder Onboarding page
    status: completed
  - id: animations
    content: Add Framer Motion scroll animations and polish responsive design
    status: completed
isProject: false
---

# Fintech Platform Landing Page

## Tech Stack

- **React 18** via **Vite** (fast dev server, modern tooling)
- **Tailwind CSS v4** for styling
- **React Router** for navigation (hero "Get Started" button will route to `/onboarding` -- placeholder for now)
- **Lucide React** for icons
- **Framer Motion** for subtle scroll animations

## Project Structure

```
fintech-platform/
├── public/
├── src/
│   ├── assets/            # any static images
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── AIChat.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Testimonials.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Landing.jsx     # composes all sections
│   │   └── Onboarding.jsx  # placeholder page
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Page Sections (top to bottom)

### 1. Navbar
- Logo/brand name on the left
- Nav links: Features, How It Works, About
- "Get Started" button on the right (scrolls or navigates to onboarding)

### 2. Hero Section
- **Abstract gradient/mesh background** generated with CSS (radial gradients, animated blobs) -- no external image needed, purely CSS-driven for performance and visual appeal
- Headline: something like *"Unlock Higher Yields with Smarter Alternative Investments"*
- Subheadline explaining the 10-18% return range across invoice discounting, P2P lending, private credit, etc.
- Prominent **"Get Started"** button that routes to `/onboarding` (placeholder page for now)
- Trust indicators (e.g., "Trusted by 10,000+ investors", "RBI Compliant", "Bank-grade Security")

### 3. Features Section -- "One Platform, All Solutions"
- Grid of cards highlighting the investment types:
  - Invoice Discounting
  - P2P Lending
  - Private Credit
  - Structured Debt
  - Revenue-based Financing
- Each card with an icon, short description, and indicative return range

### 4. AI Chat / Smart Advisor Section
- Split layout: illustration/mockup on one side, copy on the other
- Headline: *"AI-Powered Investment Guidance"*
- Copy explaining:
  - Chat with an AI advisor to understand your risk profile
  - Get personalized investment recommendations
  - Ask questions in plain language, get clear answers
- A mock chat UI preview showing a sample conversation

### 5. How It Works Section
- 3-step visual flow:
  1. **Sign Up** -- Complete quick KYC in under 2 minutes
  2. **Get Matched** -- AI analyzes your goals and risk appetite
  3. **Start Earning** -- Invest and track returns on one dashboard

### 6. Final CTA Section
- Bold background with a strong call to action
- "Start your investment journey today"
- Another "Get Started" button

### 7. Footer
- Links: About, Terms, Privacy, Contact
- Social media icons
- "Made in India" badge

## Design Direction
- **Color palette**: Deep navy/dark blue primary (#0F172A), electric blue accent (#3B82F6), white text, subtle gradients
- **Typography**: Clean sans-serif (Inter via Google Fonts)
- **Style**: Modern fintech aesthetic -- clean lines, generous whitespace, subtle glassmorphism cards, smooth scroll animations
- The abstract hero background will use CSS `radial-gradient` blobs with `mix-blend-mode` and subtle animation for a dynamic, premium feel

## Routing
- `/` -- Landing page (all sections)
- `/onboarding` -- Placeholder page with a simple "Onboarding coming soon" message and a back button

## Key Implementation Notes
- All sections will be individual components composed in `Landing.jsx`
- The "Get Started" buttons use React Router's `useNavigate` to go to `/onboarding`
- Smooth scroll for in-page navigation links in the navbar
- Responsive design: mobile-first with Tailwind breakpoints
- Framer Motion for fade-in-on-scroll effects on each section
