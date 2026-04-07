# YieldVest — Design System & Style Guidelines

The definitive design reference for the YieldVest platform. All new pages, components, and features must follow these guidelines to maintain visual consistency.

---

## 1. Design Philosophy

YieldVest follows a **light, minimal, card-driven** aesthetic rooted in:

- **Quiet confidence** — clean typography that communicates trust without shouting
- **Generous whitespace** — content breathes; every element earns its place on the page
- **Card-first layout** — information is organized into bordered, contained cards with subtle shadows
- **Restrained color** — a near-monochrome palette with a single muted accent; no bright or "pop-up" colors
- **Formal professionalism** — the design should feel like an institutional financial product, not a flashy startup

The overall experience should feel like a **premium fintech platform** — trustworthy, precise, and understated. Think Linear, Stripe, or Mercury — not Robinhood.

---

## 2. Color Palette

### Core Colors

| Role | Tailwind Token | Value | Usage |
|------|----------------|-------|-------|
| **Background (Primary)** | `bg` | `#FFFFFF` | Page background, white sections |
| **Background (Alternate)** | `bg-alt` | `#F9FAFB` | Alternating sections, input fields, icon containers |
| **Background (Elevated)** | `bg-elevated` | `#FFFFFF` | Cards, modals, elevated surfaces |
| **Border** | `border` | `#E5E7EB` | Card borders, dividers, input outlines |
| **Border (Light)** | `border-light` | `#F3F4F6` | Very subtle separators |
| **Text (Primary)** | `text-primary` | `#111827` | Headlines, card titles, primary content |
| **Text (Secondary)** | `text-secondary` | `#6B7280` | Body copy, descriptions, nav links |
| **Text (Muted)** | `text-muted` | `#9CA3AF` | Captions, metadata, section labels, placeholders |
| **Accent** | `accent` | `#18181B` | Primary CTA buttons, inverted CTA blocks |
| **Accent (Soft)** | `accent-soft` | `#F4F4F5` | Hover states on light backgrounds |
| **Green** | `green` | `#059669` | Positive indicators (return rates, online status, logo icon) |
| **Green (Soft)** | `green-soft` | `#ECFDF5` | Return rate badge background |

### Usage Principles

- The page is **light-first** — white and light gray backgrounds only
- The primary accent is **near-black** (`#18181B`) — used for CTA buttons and the inverted CTA section
- **Green** (`#059669`) is used sparingly — only for return rate badges, the logo icon, and positive status indicators
- **Never** use orange, amber, yellow, bright blue, or any saturated "pop" color
- No gradients on buttons or text — all fills are flat, solid colors
- Borders are always `#E5E7EB` — thin (1px), never heavy
- Card hover states use `shadow-md` — no color shifts on borders

---

## 3. Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Inter is used for everything — headings, body, UI elements. No secondary typeface.

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing | Tailwind Classes |
|---------|------|--------|-------------|----------------|------------------|
| **Hero Headline** | `clamp(2.25rem, 5vw, 4rem)` | 600 (semibold) | 1.1 | `-0.025em` | `text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.025em]` |
| **Section Headline** | `1.875rem` / `2.25rem` | 600 (semibold) | 1.1 | `-0.02em` | `text-3xl sm:text-4xl font-semibold tracking-[-0.02em]` |
| **Card Title** | `1rem` | 600 (semibold) | — | — | `text-base font-semibold` |
| **Body (Large)** | `1.125rem` | 400 (regular) | 1.625 | `0` | `text-lg leading-relaxed` |
| **Body (Default)** | `1rem` | 400 (regular) | 1.625 | `0` | `text-base leading-relaxed` |
| **Body (Small)** | `0.875rem` | 400 (regular) | 1.625 | `0` | `text-sm leading-relaxed` |
| **Section Label** | `0.875rem` | 500 (medium) | — | `0` | `text-sm font-medium text-text-muted` |
| **Nav Links** | `0.875rem` | 500 (medium) | — | `0` | `text-sm font-medium text-text-secondary` |
| **CTA Button Text** | `0.875rem` | 500 (medium) | — | `0` | `text-sm font-medium` |
| **Caption / Label** | `0.75rem` | 500–600 | — | `wider` | `text-xs font-semibold uppercase tracking-wider` |

### Typographic Patterns

- **Headings use `font-semibold` (600)** — never `bold` (700) or `extrabold` (800). This keeps the tone formal without being aggressive.
- **Sentence case for all headings** — "One platform, every opportunity" not "One Platform, Every Opportunity"
- **Single accent word in hero** — one word in the hero headline is colored `text-green` for subtle emphasis. No gradient text.
- **Section labels** are plain `text-sm font-medium text-text-muted` placed above the heading — not uppercase, not colored. They serve as quiet category markers.
- **No decorative type effects** — no gradient text, no typewriter animations, no rotating words

---

## 4. Spacing & Layout

### Container

```css
max-width: 72rem; /* 1152px — Tailwind max-w-6xl */
margin: 0 auto;
padding: 0 24px; /* px-6 */
```

### Section Rhythm

| Property | Desktop | Mobile |
|----------|---------|--------|
| **Vertical section padding** | `128px` (`py-32`) | `96px` (`py-24`) |
| **Space: label to heading** | `8px` (`mb-2`) | `8px` |
| **Space: heading to body** | `16px` (`mb-4`) | `16px` |
| **Space: section header to content** | `64px` (`mb-16`) | `64px` |
| **Card gap** | `16px` (`gap-4`) | `16px` |
| **Card internal padding** | `24px` (`p-6`) | `24px` |

### Layout Patterns

- **Centered hero** — text centered, constrained to `max-w-3xl` (48rem)
- **Left-aligned section headers** — headings are flush-left with a muted label above and description below
- **Card grids** — `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` for feature cards
- **50/50 split** — `grid lg:grid-cols-2 gap-12 lg:gap-20` for content + visual sections (AI Chat)
- **Alternating backgrounds** — sections alternate between `bg` (white) and `bg-alt` (#F9FAFB) for visual rhythm without dividers
- **No decorative dividers** — section separation comes purely from background color alternation and padding

---

## 5. Components

### Navigation

```
Fixed top, white/frosted glass background, single bottom border.
```

| Property | Value | Tailwind |
|----------|-------|----------|
| Position | Fixed, full-width, z-50 | `fixed top-0 left-0 right-0 z-50` |
| Background | White at 80% opacity + blur | `bg-white/80 backdrop-blur-xl` |
| Border | Bottom, `#E5E7EB` | `border-b border-border` |
| Height | 64px | `h-16` |
| Logo | `text-lg font-semibold` with green icon | — |
| Nav links | `text-sm font-medium text-text-secondary` | hover → `text-text-primary` |
| CTA button | Solid `bg-accent` (near-black), white text | `rounded-lg bg-accent px-5 py-2` |
| Mobile | Hamburger toggle, dropdown with same styles | `md:hidden` / `md:flex` |

### Buttons

**Primary CTA**
```
Solid near-black background, white text. No gradients. Subtle opacity on hover.
```

```css
/* Tailwind */
rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white
transition-colors hover:bg-accent/90
```

**Secondary / Ghost**
```
White background, border, dark text. Light fill on hover.
```

```css
/* Tailwind */
rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary
transition-colors hover:bg-bg-alt
```

**Inverted (on dark backgrounds)**
```
White background, accent-colored text. Used inside the CTA section.
```

```css
/* Tailwind */
rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-accent
transition-colors hover:bg-white/90
```

### Badge / Pill

```
Subtle bordered pill used above the hero headline. Neutral colors only.
```

```css
/* Tailwind */
inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt
px-3.5 py-1 text-xs font-medium text-text-secondary
```

### Cards

```
White background, thin border, rounded corners. Shadow on hover.
```

```css
/* Tailwind */
rounded-xl border border-border bg-white p-6
transition-shadow hover:shadow-md
```

- Internal icon containers: `rounded-lg bg-bg-alt p-2.5` with `text-text-secondary` icons
- Card titles: `text-base font-semibold text-text-primary`
- Card body: `text-sm leading-relaxed text-text-secondary`
- Return badges (where applicable): `rounded-md bg-green-soft px-2.5 py-0.5 text-sm font-medium text-green`

### Step Cards (How It Works)

Same as standard cards, with the step number displayed large and faded in the top-right corner:

```css
/* Step number */
text-2xl font-semibold tabular-nums text-border
/* e.g., "01", "02", "03" */
```

The icon and number sit in a row with `justify-between` at the top of the card.

### Chat Mockup (AI Advisor)

```
Standard bordered card (rounded-xl border border-border bg-white shadow-sm) containing:
- Header: avatar circle + name/status, separated by border-b
- Messages: user bubbles (bg-accent text-white), AI bubbles (bg-bg-alt text-text-secondary)
- Input: bordered input mock at the bottom
```

User message bubbles use `rounded-2xl rounded-br-md bg-accent text-white`.
AI message bubbles use `rounded-2xl rounded-bl-md bg-bg-alt text-text-secondary`.

### Feature List (Benefit Items)

```
Icon in a bg-bg-alt rounded-lg container on the left.
Title (text-sm font-semibold text-text-primary) and description (text-sm text-text-secondary) on the right.
Stacked vertically with space-y-5.
```

### CTA Section (Inverted)

```
Solid bg-accent (near-black) rounded-2xl card. Centered text.
Heading and body in white. Button is inverted (bg-white text-accent).
```

```css
/* Tailwind */
rounded-2xl bg-accent px-8 py-16 sm:px-16 sm:py-20 text-center
```

### Footer

```
White background, border-t border-border. 4-column grid on desktop.
Column headers: text-xs font-semibold uppercase tracking-wider text-text-muted
Links: text-sm text-text-secondary hover:text-text-primary
Bottom bar: border-t, text-xs text-text-muted, flex justify-between
```

---

## 6. Visual Effects & Decoration

### Background Treatments

- **No background decorations** — no dot grids, no radial glows, no animated blobs, no noise textures
- Section depth is achieved through **background color alternation** (white ↔ #F9FAFB) only
- The hero section is a clean white background — no visual effects behind it

### Animations & Motion

Framer Motion is used for **subtle entrance animations only**:

- **Fade-in on scroll**: `opacity: 0 → 1` with `translateY(16px → 0)` using `whileInView`
- **Staggered card reveals**: Cards in grids use sequential `animation-delay` (0.06s per card)
- **Duration**: All animations use `duration: 0.4s` — fast and crisp, never slow or dramatic
- **No hover animations on cards** — cards use CSS `transition-shadow` for hover, not transform/translate
- **No marquees, no typewriter effects, no parallax**

### Shadows

| Use Case | Value | Tailwind |
|----------|-------|----------|
| **Default card** | None (border only) | — |
| **Card hover** | `0 4px 6px -1px rgba(0,0,0,0.1)` | `shadow-md` |
| **Chat mockup** | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-sm` |
| **CTA section** | None | — |

### Dividers

- Section-level dividers come from background color changes — no `<hr>` or gradient fades
- Within sections, `border-t border-border` is used sparingly (footer bottom bar, chat input separator)

---

## 7. Iconography

- **Lucide React** is the icon library — no other icon sets
- Icons are **20px** (`h-5 w-5`) as the default size, **16px** (`h-4 w-4`) for smaller contexts (buttons, trust items)
- Icon color is always `text-text-secondary` (#6B7280) — never colored or accented (except the logo icon which uses `text-green`)
- Icon containers use `rounded-lg bg-bg-alt p-2.5` — a soft gray background
- Avatars use `rounded-full bg-bg-alt` as containers
- No decorative icons — every icon serves a functional purpose

---

## 8. Section Structure Reference

### Hero Section
```
[Navbar — fixed, white frosted glass]
[Badge pill — "AI-Powered Alternative Investments"]
[H1 — centered, max-w-3xl, one word in text-green]
[Body paragraph — centered, max-w-xl, text-text-secondary]
[Two buttons — primary (dark) + secondary (ghost border)]
[Trust indicators — small muted text with tiny icons]
```

### Features Section (bg-alt)
```
[Section label — "Investment Options", text-sm text-text-muted]
[H2 — left-aligned, text-3xl/4xl]
[Body paragraph — left-aligned, max-w-xl]
[Card grid — 3 columns, white cards on gray bg]
  [Each card: icon container → title → description → return badge]
```

### AI Advisor Section (bg-white)
```
[50/50 split grid]
  [Left: label → H2 → body → feature list with icons]
  [Right: chat mockup card with header, messages, input]
```

### How It Works Section (bg-alt)
```
[Section label → H2 → body paragraph]
[3-column card grid]
  [Each card: icon + step number (faded) → title → description]
```

### CTA Section (bg-white, contains dark card)
```
[Rounded dark (bg-accent) card, centered within max-w-6xl]
  [H2 — white text]
  [Body — white/70 text]
  [Button — inverted white, text-accent]
```

### Footer (bg-white, border-t)
```
[4-column grid: brand + 3 link columns]
[Bottom bar: copyright left, disclaimer right]
```

---

## 9. Responsive Behavior

| Breakpoint | Tailwind Prefix | Behavior |
|------------|-----------------|----------|
| `< 640px` (mobile) | default | Single column, full-width buttons stacked, hamburger nav, `py-24` sections |
| `640–768px` (sm) | `sm:` | Two-column card grids, inline buttons, `py-32` sections |
| `768–1024px` (md) | `md:` | Desktop nav visible (`md:flex`), three-column grids |
| `> 1024px` (lg) | `lg:` | 50/50 splits for AI section, full three-column grids |

- Hero headline uses `clamp(2.25rem, 5vw, 4rem)` for fluid scaling
- Section headings use `text-3xl sm:text-4xl` (responsive step)
- Container max-width is `max-w-6xl` (1152px) with `px-6` padding
- Navigation collapses to hamburger below `md` (768px)

---

## 10. Voice & Copy Style

The copy tone is **professional, clear, and understated**:

- **Sentence case for all headings** — "Three steps to get started" not "Three Steps To Get Started"
- **No exclamation marks** in headings
- **No slang, no informality** — "No kidding" and "Seriously" are not appropriate
- **Concise descriptions** — one sentence per card description, two sentences max per section body
- **Question-form CTAs** where appropriate — "Ready to invest smarter?" rather than "Start Now!"
- **Action verbs in buttons** — "Get Started", "Create Free Account", "Learn More"
- **Trust language is subtle** — small muted text, not large bold claims
- **Section labels are descriptive** — "Investment Options", "AI Advisor", "How It Works"

---

## 11. Tailwind Theme Configuration (index.css)

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --color-bg: #FFFFFF;
  --color-bg-alt: #F9FAFB;
  --color-bg-elevated: #FFFFFF;

  --color-border: #E5E7EB;
  --color-border-light: #F3F4F6;

  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;

  --color-accent: #18181B;
  --color-accent-soft: #F4F4F5;
  --color-green: #059669;
  --color-green-soft: #ECFDF5;
}
```

These tokens are available as Tailwind utilities: `bg-bg`, `text-text-primary`, `border-border`, `bg-accent`, `text-green`, `bg-green-soft`, etc.

---

## 12. Do's and Don'ts

### Do

- Use white and light gray (#F9FAFB) as the only background colors
- Use near-black (#18181B) for primary CTA buttons — solid, no gradients
- Use muted green (#059669) sparingly — return badges and logo icon only
- Keep typography at `font-semibold` (600) max for headings
- Use bordered, white cards with subtle hover shadows for all content blocks
- Maintain generous padding (py-24 / py-32) between sections
- Use sentence case for all headings
- Alternate section backgrounds (white → gray → white) for rhythm
- Keep animations fast (0.4s) and subtle (16px translateY + opacity)
- Use Lucide React for all icons, colored `text-text-secondary`

### Don't

- Use dark/black backgrounds (except the single CTA section card)
- Use orange, amber, yellow, bright blue, purple, or any saturated accent
- Use gradient fills on buttons, text, or backgrounds
- Use animated blobs, dot grids, radial glows, or noise textures
- Use `font-bold` (700) or `font-extrabold` (800) for headings
- Use Title Case or ALL CAPS for section headings (uppercase is OK for tiny labels only)
- Use decorative stock photography or illustration
- Over-animate — no marquees, parallax, typewriter effects, or hover transforms on cards
- Add drop shadows to anything except hover states on cards
- Use more than one typeface

---

*YieldVest Design System — April 2026*
