---
name: Academic Collision Engine
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#ab0b1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#cf2c30'
  on-tertiary-container: '#ffecea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  time-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes a high-clarity, reassuring, and utility-driven mobile interface tailored for higher education students juggling complex academic timetables, extracurricular commitments, and personal routines. 

The aesthetic marries modern utility with gentle, structured surfaces. The core emotional tone is calm vigilance: academic schedules are stressful, particularly during enrollment cycles and organizational recruitment phases. The UI avoids inducing panic over clashes; instead, it isolates schedule overlaps with crystalline hierarchy, surgical timeline markers, and comforting, pillowed container surfaces. 

Visual mechanics draw from a modern, refined tech aesthetic:
- **Base Canvas:** Airy, neutral surfaces (#F8FAFC, #FFFFFF) with structural slate boundaries.
- **Tonal Calibrations:** Purposeful use of high-visibility coral-red accents strictly reserved for hard overlapping blocks ("bentrok"), anchored by gentle, warm rose underlays to keep alert states readable and stress-free.
- **Physical Feel:** Ergonomic mobile surfaces configured for single-hand reach, soft rounded corners, tactile pill badges, and elevated timeline cards that visually communicate interlocking time spans.

## Colors

The color architecture enforces absolute clarity between active focus, standard context, category classifications, and operational conflicts.

### Functional Palette
- **Primary & Interactive:** Deep Royal Blue (`#2563EB`) as primary actionable tone with `#1D4ED8` for active/pressed tap targets.
- **Secondary & Structural:** Slate `#64748B` for secondary captions, inactive states, and timestamps; anchored by `#0F172A` for primary headlines and deep contrast data.
- **Critical Conflict & Alert:** Vivid Coral-Red (`#EF4444`, dark `#DC2626`) for immediate hard clashes. Associated clash backgrounds use soft rose wash fills (`#FEF2F2` for surface fill, `#FEE2E2` for borders and highlight fills).
- **Warning & Attention:** Amber (`#F59E0B`) with soft amber fills (`#FFFBEB`) for tight intervals (e.g. back-to-back classes with zero travel time).

### Category Taxonomy
To visually distinguish academic and extracurricular contexts across timeline lists and radar views:
- **Kuliah (Academic):** Background `#E0E7FF`, Label `#3730A3`, Border `#C7D2FE`.
- **Organisasi (Extracurricular):** Background `#D1FAE5`, Label `#065F46`, Border `#A7F3D0`.
- **Lainnya / Personal:** Background `#FEF3C7`, Label `#92400E`, Border `#FDE68A`.

### Surface Tiers
- **Canvas Base:** `#F8FAFC` (Slate 50)
- **Card Surface:** `#FFFFFF` (Solid White)
- **Subtle Partition / Outlines:** `#F1F5F9` (Slate 100) and `#E2E8F0` (Slate 200)

## Typography

The type system prioritizes micro-scale density and numerical legibility across dense calendars:
- **Headings & Body (Plus Jakarta Sans):** Brings a welcoming, human, contemporary feel that removes bureaucratic stiffness from university course codes and room schedules.
- **Metrics, Badges & Timestamps (Inter):** Uses `font-feature-settings: "tnum"` (tabular figures) across all scheduling intervals (e.g. `13.00 - 15.00`) to guarantee vertical axis alignment when schedules sit alongside or stack against one another.
- **Hierarchy Rules:** Never use body text below 12px for primary metadata. Room codes (e.g., `Lab GK 302`) take medium weights with muted secondary slate (#64748B) to preserve visual breathing room around course titles.

## Layout & Spacing

The layout is built for a 375pt viewport width (iPhone portrait architecture):
- **Base Grid:** Single-column modular stacked view with a strict 4pt/8pt rhythm. Margin padding along the viewport edge is locked to `16px` (`margin`), leaving a content canvas width of `343px`.
- **Vertical Rhythm:**
  - Card-to-card structural flow: `space-md` (12px) for related timeline items; `space-xl` (24px) between day partitions.
  - Internal card padding: `16px` (`space-lg`) on standard items, compacting to `12px` (`space-md`) on nested conflict breakdown drawers.
- **Touch Ergonomics:** All actionable elements maintain a minimum target of `48px x 48px`, with key action buttons pinned into a sticky bottom safe-area floating dock.

## Elevation & Depth

Depth in this system relies on soft ambient light rather than harsh structural drop shadows, keeping information clean and breathable:

- **Level 0 (Flat Surface):** Direct canvas exposure (`#F8FAFC`) with no shadow.
- **Level 1 (Resting Cards & Timeline Items):** `#FFFFFF` fill, 1px perimeter border in `#F1F5F9`, ambient shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active Collision Card / Floating Nav):** `#FFFFFF` fill with `0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Collision Accent Overlays):** Tinted drop shadows on collision elements: `0 4px 14px 0 rgba(239, 68, 68, 0.15)`.
- **Level 4 (Modals & Bottom Drawers):** `0 20px 32px -8px rgba(15, 23, 42, 0.16)`.

## Shapes

The design system adopts a soft, friendly curvature that softens the intensity of overlapping schedules:
- **Base Cards & Timeline Modules:** `16px` (`rounded-2xl`) corner radius.
- **High-Priority Collision Banners & Modals:** `20px` to `24px` (`rounded-3xl`) for large contextual wrapper cards.
- **Category Badges, Status Pills, and Indicators:** Fully rounded pill shapes (`9999px` / `rounded-full`).
- **Interactive Buttons & Input Fields:** `12px` (`rounded-xl`) to maintain crisp boundaries without conflicting with smaller category chips.

## Components

### 1. Collision Alert Banners (Radar Alert)
- **Container:** Background `#FEF2F2`, border 1px solid `#FEE2E2`, border-radius 16px.
- **Visual Accent:** Left-edge conflict accent strip (4px wide solid `#EF4444`).
- **Content Structure:** Warning icon (vivid coral-red), conflict summary headline (`headline-sm`, `#0F172A`), time delta badge, and a secondary text row displaying the colliding course codes.

### 2. Schedule Event Cards
- **Normal State:** `#FFFFFF` background, 1px solid `#E2E8F0` border, `16px` border-radius. Displays tabular timeline column on the left (e.g. `08.00`, 32px width), separated by a subtle vertical border (`#F1F5F9`), with title, room location, and category badge on the right.
- **Clash / Bentrok State:** `#FFFFFF` card framed by a 1.5px solid `#EF4444` border. Includes a persistent `#FEF2F2` alert strip at the bottom of the card displaying "Bentrok dengan: [Event Name]" with a tap action to expand the resolution drawer.

### 3. Category Chips & Badges
- **Form:** Fully rounded pill shape (`padding: 4px 10px`).
- **Kuliah:** Background `#E0E7FF`, text `#3730A3` (`label-sm`).
- **Organisasi:** Background `#D1FAE5`, text `#065F46` (`label-sm`).
- **Lainnya:** Background `#FEF3C7`, text `#92400E` (`label-sm`).

### 4. Interactive Buttons
- **Primary Action (e.g., 'Atur Jadwal', 'Pecahkan Bentrokan'):** `#2563EB` background, `#FFFFFF` text, min-height `48px`, border-radius `12px`, active press state scales slightly to `0.98` with background darkening to `#1D4ED8`.
- **Secondary / Ghost Action:** `#FFFFFF` background, 1px solid `#E2E8F0`, `#0F172A` text.
- **Destructive / Drop Slot:** `#FEF2F2` background, `#EF4444` text, border 1px solid `#FEE2E2`.

### 5. Timeline Rail & Intersect Marks
- Vertical track running along the schedule view (2px wide `#E2E8F0`).
- Overlap zones render a duplicate branch line in `#EF4444` spanning the exact overlapping duration (e.g., `13.30 - 14.00`) to visualize the clash directly on the timeline.

### 6. Floating Action Dock (Bottom Bar)
- Pinned bottom bar with glassmorphic backdrop filter (`backdrop-blur-md`, background `rgba(255, 255, 255, 0.9)`), top border 1px `#E2E8F0`.
- Houses the quick-add floating trigger and the persistent status badge ("Radar: 2 Bentrokan Terdeteksi").