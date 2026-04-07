# Rocket.new — Design System & Style Guidelines

A comprehensive design reference extracted from [rocket.new](https://www.rocket.new) for building visually consistent websites in the same style.

---

## 1. Design Philosophy

Rocket.new follows a **dark, cinematic, high-contrast** aesthetic rooted in:

- **Bold confidence** — large, unapologetic typography that commands attention
- **Space & depth** — generous negative space with layered visuals and glowing elements
- **Minimal UI chrome** — the interface stays out of the way; content and imagery do the talking
- **Futuristic warmth** — dark backgrounds paired with warm amber/orange accents instead of cold blues, making the "tech" aesthetic feel human and energetic
- **Immersive full-bleed sections** — full-width background images and gradients create a cinematic feel between content sections

The overall experience feels like a **premium SaaS product** meets a **bold startup landing page** — fast, confident, and visually rich without being cluttered.

---

## 2. Color Palette

### Core Colors

| Role | Value | Usage |
|------|-------|-------|
| **Background (Primary)** | `#0A0A0A` / `#0D0D0D` | Page background, section fills |
| **Background (Elevated)** | `#111111` / `#141414` | Cards, modals, nav |
| **Background (Surface)** | `#1A1A1A` / `#1E1E1E` | Subtle containers, input fields |
| **Border / Divider** | `#222222` / `#2A2A2A` | Subtle lines, card borders |
| **Text (Primary)** | `#FFFFFF` | Headlines, primary content |
| **Text (Secondary)** | `#A0A0A0` / `#888888` | Body copy, descriptions |
| **Text (Muted)** | `#555555` / `#444444` | Captions, metadata |
| **Accent (Primary)** | `#F97316` / `#FB923C` | Orange — CTAs, active states, highlights |
| **Accent (Warm)** | `#FBBF24` / `#F59E0B` | Amber — gradient partner to orange |
| **Accent (Glow)** | `rgba(249,115,22,0.15)` | Glow effects around accent elements |

### Accent Gradient

```css
/* Primary CTA gradient */
background: linear-gradient(135deg, #F97316, #FBBF24);

/* Subtle warm glow */
background: radial-gradient(ellipse at center, rgba(249,115,22,0.2) 0%, transparent 70%);
```

### Usage Principles

- The page is **dark-first** — never use white backgrounds
- Orange/amber accents are used **sparingly** — reserved for CTAs, numbered step indicators, highlighted text, and interactive states
- Avoid cold accent colors (blues, purples, cyans) — the warmth of amber/orange is core to the brand feel
- Glassmorphism is used subtly — `backdrop-filter: blur()` on nav and overlays

---

## 3. Typography

### Font Stack

```css
/* Display / Headings */
font-family: 'Geist', 'Inter', -apple-system, sans-serif;

/* Body / UI */
font-family: 'Geist', 'Inter', -apple-system, sans-serif;
```

> Rocket.new uses a clean, modern sans-serif with tight letter-spacing on headings and slightly relaxed spacing on body text. The feel is **geometric and precise**, not humanist or playful.

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **Hero Headline** | `clamp(3rem, 7vw, 6rem)` | 700–800 | 1.0–1.05 | `-0.03em` |
| **Section Headline** | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.1 | `-0.02em` |
| **Sub-headline** | `1.5rem–2rem` | 600 | 1.2 | `-0.01em` |
| **Body (Large)** | `1.125rem` | 400 | 1.7 | `0` |
| **Body (Default)** | `1rem` | 400 | 1.6 | `0` |
| **Caption / Label** | `0.75rem–0.875rem` | 500 | 1.4 | `0.05em` |
| **Nav Links** | `0.9rem` | 500 | — | `0.01em` |
| **CTA Button** | `1rem–1.125rem` | 600 | — | `0.01em` |

### Typographic Patterns

- **Multi-line hero headlines** — each line is its own `<span>` or block element, sometimes with alternating weights or colors
- **Gradient text** on key phrases: `background: linear-gradient(90deg, #F97316, #FBBF24); -webkit-background-clip: text; color: transparent;`
- **"Typewriter" / rotating word** effect inside headlines (e.g., "mobile app | web app | dashboard")
- Uppercase small labels (`letter-spacing: 0.1em`) before section headings act as category tags
- Numbers in step-by-step sections use a different weight/color (orange accent) to visually separate them from content text

---

## 4. Spacing & Layout

### Grid

```css
/* Container */
max-width: 1280px;
margin: 0 auto;
padding: 0 24px; /* mobile */
padding: 0 48px; /* tablet */
padding: 0 80px; /* desktop */
```

### Spacing Scale

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  24px;
--space-6:  32px;
--space-7:  48px;
--space-8:  64px;
--space-9:  96px;
--space-10: 128px;
--space-11: 160px;
--space-12: 200px;
```

### Section Rhythm

- **Vertical padding per section**: `80px–160px` (desktop), `48px–80px` (mobile)
- **Space between headline and body**: `24px–32px`
- **Space between body and CTA**: `32px–48px`
- **Card internal padding**: `24px–32px`
- Sections separated by **full-bleed image/video dividers** rather than plain horizontal rules

### Layout Patterns

- **Split layout** (50/50): Feature explanation on left, numbered steps / visual on right
- **Centered hero**: Text centered, full-width background visual behind it
- **Asymmetric feature rows**: Text-heavy left column with staggered visual elements on right
- **Testimonial grid**: Dual-column scrolling marquee on dark background
- Template section uses **horizontal pill-tab navigation** above a single preview pane
- Step indicators use `1.1`, `1.2`, `1.3` decimal numbering, left-aligned

---

## 5. Components

### Navigation

```css
/* Floating / sticky nav */
position: sticky; top: 0;
background: rgba(10,10,10,0.8);
backdrop-filter: blur(16px);
border-bottom: 1px solid #1E1E1E;
padding: 0 48px;
height: 64px;
z-index: 100;
```

- Logo on far left
- Nav links centered or slightly right
- CTA button ("Sign in / Sign up") on far right — text or ghost style
- No heavy shadows; relies on the blur + border for depth

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: linear-gradient(135deg, #F97316, #FBBF24);
  color: #000;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 28px;
  border: none;
  font-size: 1rem;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary / Ghost */
.btn-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s;
}
.btn-ghost:hover {
  border-color: #F97316;
  background: rgba(249,115,22,0.05);
}

/* Text / Link CTA (in-page) */
.btn-text {
  color: #F97316;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

### Badge / Tag Pill

```css
/* "New" badge before headline */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(249,115,22,0.1);
  border: 1px solid rgba(249,115,22,0.3);
  color: #F97316;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Cards

```css
.card {
  background: #111111;
  border: 1px solid #1E1E1E;
  border-radius: 16px;
  padding: 28px;
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover {
  border-color: rgba(249,115,22,0.3);
  transform: translateY(-2px);
}
```

### Testimonial Card

```css
.testimonial {
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 360px;
}
.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.testimonial-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
}
.testimonial-handle {
  font-size: 0.8rem;
  color: #666;
}
.testimonial-quote {
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.6;
  margin-top: 12px;
}
```

### Step List (Numbered Features)

```css
.step-number {
  color: #F97316;
  font-weight: 700;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  min-width: 32px;
}
.step-text {
  color: #D0D0D0;
  font-size: 0.95rem;
  line-height: 1.5;
}
```

### Tab Navigation (Templates)

```css
.tab-nav {
  display: flex;
  gap: 4px;
  background: #111;
  border-radius: 999px;
  padding: 4px;
  width: fit-content;
}
.tab {
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: #1E1E1E;
  color: #fff;
}
```

### FAQ Accordion

```css
.faq-item {
  border-bottom: 1px solid #1E1E1E;
  padding: 20px 0;
}
.faq-question {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-answer {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.7;
  margin-top: 12px;
}
```

---

## 6. Visual Effects & Decoration

### Background Treatments

- **Full-bleed image sections**: Critical cinematic moments (hero, "how it works", footer) use full-width `.webp` images as section backgrounds — dark, atmospheric, slightly blurred edges
- **Radial glow**: Soft orange/amber radial gradient centered under hero text
  ```css
  background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249,115,22,0.12), transparent);
  ```
- **Noise texture overlay** (subtle): `opacity: 0.03` grain on dark backgrounds adds depth
- **Grid dot pattern** on dark backgrounds for subtle texture:
  ```css
  background-image: radial-gradient(circle, #333 1px, transparent 1px);
  background-size: 32px 32px;
  ```

### Animations & Motion

- **Marquee / infinite scroll**: Testimonials and logo strips use CSS `@keyframes` infinite horizontal scroll
  ```css
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .marquee-track { animation: marquee 30s linear infinite; }
  ```
- **Fade-in on scroll**: Sections animate in with `opacity: 0 → 1` and `translateY(20px → 0)` using Intersection Observer
- **Typewriter / text rotation**: Hero headline cycles through words with a blinking cursor `|`
- **Hover lifts**: Cards and buttons use `transform: translateY(-2px)` on hover
- **Staggered reveals**: Feature list items appear sequentially with `animation-delay`

### Dividers

- No plain `<hr>` lines — dividers are atmospheric full-bleed images or gradient fades to black
- Between sections: `background: linear-gradient(to bottom, transparent, #0A0A0A)` overlay at section edges

---

## 7. Iconography & Media

- **No icon library clutter** — icons are minimal and purposeful; custom SVGs or very simple geometric shapes
- Avatar images use circular crop (`border-radius: 50%`), ~40–48px size
- Product screenshots / template previews use subtle rounded corners (`border-radius: 12px`) and a faint border (`1px solid #222`)
- Images are `.webp` format, loaded via `srcset` for performance
- No decorative stock photography — imagery is either product UI screenshots or abstract/atmospheric photography

---

## 8. Section Structure Reference

### Hero Section
```
[Navbar]
[Badge pill: "New – Rocket Mobile is here →"]
[H1: "Think It. Type It. Launch It."]
[H2 with rotating word: "Build production-ready [web app | mobile app | dashboard]"]
[Trust signal: "Trusted by 1M+ users in 180+ countries"]
[Logo strip marquee]
[Full-bleed background image]
```

### Feature/How-It-Works Section
```
[Section label (uppercase, muted)]
[H2: Bold two-line headline]
[Body paragraph]
[Pill tab row: "One prompt | Backend | Launch | Templates"]
[Left: numbered step list]  [Right: product screenshot/visual]
[Inline CTA: "Try it →"]
```

### Testimonials Section
```
[H2: "Happiness speaks"]
[Subtext: user count + countries]
[Full-bleed dark background image]
[Dual-row infinite marquee of testimonial cards]
```

### FAQ Section
```
[H2: centered]
[Accordion list: question/answer pairs]
[Support footer: links to docs, tutorials, Discord]
```

### Footer CTA Section
```
[Full-bleed atmospheric image]
[Large H2: "Start building, now!"]
[Subtext tagline]
[Standard footer: copyright + legal links]
```

---

## 9. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` (mobile) | Single column, reduced heading sizes, full-width CTAs, stacked nav |
| `640–1024px` (tablet) | Two columns for features, slightly reduced padding |
| `> 1024px` (desktop) | Full layout as described above |

- Font sizes use `clamp()` to scale fluidly
- Navigation collapses to hamburger on mobile
- The typewriter / rotating word effect persists across all breakpoints
- Marquees slow down on mobile for readability

---

## 10. Voice & Copy Style

While not strictly visual, the copy tone shapes how the design reads:

- **Short, punchy headlines** — often imperative or declarative ("Think It. Type It. Launch It.")
- **Contrasting two-part headlines** — `[Bold claim] + [qualifier]` across two lines
- **Self-aware confidence** — "No kidding." / "Seriously." as parenthetical asides
- **Numbered sub-points** use decimal notation (1.1, 1.2, 1.3) to feel systematic and credible
- **Social proof leads** — user count + countries appears prominently near the hero
- **CTAs are action-first**: "Start building", "Try it", "Launch your idea, now" — not passive ("Learn more")

---

## 11. CSS Custom Properties Reference

```css
:root {
  /* Colors */
  --color-bg:           #0A0A0A;
  --color-bg-elevated:  #111111;
  --color-bg-surface:   #1A1A1A;
  --color-border:       #1E1E1E;
  --color-border-light: #2A2A2A;

  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-muted:     #555555;

  --color-accent:         #F97316;
  --color-accent-warm:    #FBBF24;
  --color-accent-glow:    rgba(249, 115, 22, 0.15);

  /* Typography */
  --font-sans: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold: 600;
  --font-weight-bold:    700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;

  /* Radii */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  --shadow-glow: 0 0 40px rgba(249,115,22,0.2);

  /* Transitions */
  --transition-fast:   0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow:   0.4s ease;

  /* Layout */
  --container-max: 1280px;
  --nav-height:    64px;
}
```

---

## 12. Do's and Don'ts

### ✅ Do
- Use a near-black background as the base for all pages
- Rely on orange/amber for all accent moments — buttons, highlights, numbers, hover states
- Use full-bleed atmospheric images as section separators / hero backgrounds
- Let whitespace breathe — generous padding between sections
- Make headlines huge and confident
- Use marquee animations for social proof (logos, testimonials)
- Apply subtle border + glassmorphism on nav
- Use decimal-numbered steps (1.1, 1.2, 1.3) for feature breakdowns

### ❌ Don't
- Use light/white backgrounds
- Use blue, purple, or green as primary accent colors
- Add heavy drop shadows or loud gradients on text (gradient text is fine, gradient backgrounds on text blocks are not)
- Over-animate — motion should feel purposeful, not frantic
- Use more than 2 typefaces
- Crowd content — maintain generous vertical rhythm
- Use flat button designs with no depth or interaction state
- Use generic stock photography

---

*Design extracted from [rocket.new](https://www.rocket.new) — April 2026*
