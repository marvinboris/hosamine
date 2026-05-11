# Hosamine — Design System

## Color Strategy: Committed
Forest green carries 40–50% of the website surface. Amber/gold as action color. Green is earned identity, not eco-cliché.

## Colors (OKLCH)

```css
--color-primary:        oklch(38% 0.13 145);   /* deep forest green */
--color-primary-mid:    oklch(52% 0.14 145);   /* medium green */
--color-primary-light:  oklch(70% 0.11 145);   /* lighter green */
--color-primary-pale:   oklch(95% 0.025 145);  /* near-white green tint */
--color-primary-bg:     oklch(25% 0.10 145);   /* dark green (hero sections) */

--color-accent:         oklch(70% 0.17 60);    /* warm amber */
--color-accent-dark:    oklch(52% 0.16 60);    /* deep amber */

--color-bg:             oklch(98.5% 0.005 145); /* off-white, green hint */
--color-surface:        oklch(96% 0.008 145);   /* card/panel background */
--color-border:         oklch(88% 0.015 145);   /* borders */

--color-text:           oklch(18% 0.012 145);   /* near-black, green tint */
--color-text-secondary: oklch(48% 0.020 145);   /* medium grey-green */
--color-text-inverse:   oklch(97% 0.008 145);   /* text on dark bg */
```

## Typography

- **Display/Headlines:** 'Sora', fallback 'DM Sans', sans-serif — geometric, modern, confident
- **Body:** 'Inter', fallback system-ui — readable, neutral, professional
- **Mono (internal tools):** 'JetBrains Mono', monospace

### Scale (website)
- Display XL: 4.5rem / 1.05 lh / -0.03em ls / 800 weight
- Display: 3rem / 1.1 lh / -0.025em ls / 700 weight
- H1: 2.25rem / 1.2 lh / -0.02em ls / 700 weight
- H2: 1.75rem / 1.25 lh / -0.015em ls / 600 weight
- H3: 1.25rem / 1.35 lh / 500 weight
- Body: 1rem / 1.65 lh / 400 weight
- Small: 0.875rem / 1.6 lh

## Spacing Rhythm
4px base unit. Sections alternate tight/airy for rhythm.

## Elevation
- Level 0: flat (borders only)
- Level 1: `0 1px 3px oklch(38% 0.13 145 / 0.08)`
- Level 2: `0 4px 16px oklch(38% 0.13 145 / 0.12)`
- Level 3: `0 12px 40px oklch(38% 0.13 145 / 0.18)` (modals, hero cards)

## Motif
Diagonal lines / geometric texture built from green-tinted SVG patterns — used sparingly in hero and section dividers. Not clipart; abstract precision geometry.

## Buttons
- Primary: bg accent + dark text, no border radius extremes (6px), 500 weight
- Secondary: bg transparent + primary border + primary text
- Ghost: text only + underline on hover
- All: 44px min-height, 16–24px horizontal padding

## Internal Tools (CRM / Social)
- Dark sidebar (#1a2e1a range) + light content area
- Status colors: green (active/done), amber (pending), red (overdue), grey (draft)
- Dense information layout; 14px body
