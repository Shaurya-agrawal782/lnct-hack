---
name: Tactical Command System
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2fe'
  surface-container: '#ededf9'
  surface-container-high: '#e8e7f3'
  surface-container-highest: '#e2e1ed'
  on-surface: '#1a1b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#36455b'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d5d73'
  on-tertiary-container: '#c5d6f0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#faf8ff'
  on-background: '#1a1b23'
  surface-variant: '#e2e1ed'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
This design system is engineered for mission-critical environments where clarity, speed of cognition, and reliability are paramount. The aesthetic is rooted in **Modern Corporate** principles with a distinct **Functional Minimalist** edge, removing all decorative distractions to focus on operational data.

The visual narrative conveys a sense of "calm in the storm." It uses a structured, utilitarian approach to ensure that even in high-stress scenarios, the user feels in control. The interface avoids trends like glassmorphism or vibrant gradients, opting instead for a "Tactical Operational" look: high-contrast text, clear boundaries, and a logical hierarchy that prioritizes the most urgent information first.

## Colors
The palette is dominated by a systematic range of blues and greys to establish a professional, authoritative atmosphere.

- **Primary Blue:** Used exclusively for primary actions and active states to guide the eye toward "what to do next."
- **Deep Navy:** Reserved for global navigation and sidebars, providing a strong visual anchor for the application framework.
- **State Colors:** These follow a strict semantic protocol. **Critical Red** is reserved for life-safety or immediate failure alerts. **Amber** indicates escalating risks that require monitoring. **Green** signifies cleared status or available resources.
- **Neutrals:** A range of Slates and Greys are used to define borders and secondary metadata, ensuring the primary content remains the focal point.

## Typography
This design system utilizes **Inter** for its exceptional legibility and systematic weight distribution. The typeface is highly effective for data-dense dashboards where small labels must remain readable under pressure.

We utilize a strict hierarchy to differentiate between "at-a-glance" metrics and "deep-dive" data. For information density, `body-sm` and `label-sm` are the workhorses of the system, often used in tables and property panels. Headlines use tighter letter spacing and heavier weights to maintain a commanding presence without occupying excessive vertical real estate.

## Layout & Spacing
The layout relies on a **12-column fluid grid** for the main workspace, allowing widgets and data modules to expand and contract based on the user's priority. 

The system follows an **8px base unit** spacing rhythm. In high-density areas (like incident logs or resource lists), internal padding may drop to 4px to maximize visible content. 

- **Desktop:** Sidebars are fixed at 240px-280px to maximize the central operational map or dashboard. 
- **Mobile:** Reflows to a single column with a bottom-anchored navigation bar for one-handed operational use.
- **Density:** We prioritize information density over expansive whitespace; however, gutters must remain at 16px to prevent visual "bleeding" between distinct data sets.

## Elevation & Depth
Depth is used sparingly and semantically in this design system. We rely primarily on **Tonal Layers** to separate the environment:
- **Background:** The lowest layer (Surface BG) acts as the canvas.
- **Cards/Modules:** Raised slightly using white fills and a subtle `1px` border in Slate-200.
- **Overlays/Modals:** These use a soft, tight shadow (0px 4px 12px, 10% opacity) to indicate they are active interactions on top of the workflow.

We avoid heavy drop shadows that create "fuzzy" interfaces. Instead, we use **low-contrast outlines** to define structure, ensuring the UI remains crisp and high-performance.

## Shapes
The design system employs a **Soft (4px - 6px)** corner radius. This choice strikes a balance between the "sharpness" of technical/precision software and the "modernity" of current SaaS standards. 

- **Small elements** (buttons, inputs, chips) use a 4px radius.
- **Large elements** (cards, containers) use a 8px radius.
This subtle rounding prevents the interface from feeling aggressive while maintaining its serious, professional tone.

## Components

### Buttons
- **Primary:** Solid Professional Blue with white text. High contrast is mandatory.
- **Secondary:** Transparent background with a Slate-300 border.
- **Destructive:** Solid Red, used only for permanent or high-risk actions (e.g., "End Mission").

### Chips & Status Indicators
- Status chips use a subtle background tint (10% opacity of the state color) with high-contrast bold text of the same color. For example, a Critical chip has a light red background and dark red text.

### Inputs & Fields
- Input fields use a 1px border. On focus, the border shifts to Primary Blue with a 2px "glow" (0.15 alpha). Labels are always visible above the field in `label-md` for accessibility.

### Data Tables
- The core of the system. Rows have a fixed height of 40px for high density or 56px for standard. Zebra striping is used for long-form data reading. Hover states on rows are mandatory to provide visual tracking across horizontal columns.

### Cards
- Used for dashboard widgets. Every card must have a clear header with a title and an optional "actions" area (e.g., "Export" or "Expand").