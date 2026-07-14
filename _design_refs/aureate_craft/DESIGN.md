---
name: Aureate Craft
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#4d4637'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#7f7666'
  outline-variant: '#d0c5b2'
  surface-tint: '#775a03'
  primary: '#775a03'
  on-primary: '#ffffff'
  primary-container: '#c8a44d'
  on-primary-container: '#4f3a00'
  inverse-primary: '#e8c267'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#a8a9a9'
  on-tertiary-container: '#3c3e3e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf99'
  primary-fixed-dim: '#e8c267'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for a premium craft and textile shopping experience. It balances the intricate, tactile nature of high-end materials with a digital interface that feels organized and sophisticated. The aesthetic is a hybrid of **Minimalism** and **Corporate Modern**, drawing inspiration from high-end luxury retail.

The emotional response should be one of "Creative Calm"—where the user feels that their craft is treated with the same reverence as fine art. Large amounts of whitespace (negative space) are used to allow product photography—vibrant yarns, metallic threads, and intricate tools—to serve as the primary visual interest.

## Colors

The palette is anchored in a high-contrast luxury spectrum. 

- **Primary (Gold):** Used exclusively for points of intent, active states, and call-to-action elements. It represents the "premium" nature of the catalog.
- **Secondary (Pure Black):** Used for primary typography and structural boundaries to provide a grounded, authoritative feel.
- **Support (Grays):** A scale of neutral grays (#F5F5F7 for backgrounds, #86868B for secondary text) ensures the interface remains breathable and mimics the clean lines of a high-end gallery.

## Typography

This design system utilizes a high-contrast typographic pairing to signal both heritage and modern efficiency. 

- **Headlines:** Use *Playfair Display*. The serif evokes the tradition of tailoring and craftsmanship. Large display sizes should use tighter letter spacing for a "Vogue" editorial look.
- **UI & Body:** Use *Inter*. This provides the functional, "Apple-esque" clarity required for e-commerce utility. 
- **Labels:** Small caps and increased letter spacing are used for category labels and price tags to maintain a disciplined, organized structure.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain a curated, editorial feel, transitioning to a fluid model on smaller devices.

- **Desktop:** 12-column grid with wide 64px outer margins to "frame" the content like a piece of art.
- **Spacing Rhythm:** Based on an 8px linear scale. For luxury products, use "generous" spacing—doubling the standard padding (e.g., using 32px where 16px might be functional) to convey exclusivity.
- **Alignment:** Content is generally center-aligned within containers to create a balanced, symmetrical visual weight.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and extremely **Ambient Shadows**. 

- **Surface Levels:** The base background is Pure White (#FFFFFF). Secondary sections or "containers" use a Soft Gray (#F5F5F7).
- **Shadows:** Avoid heavy, dark shadows. Use a "Large/Soft" approach: `0px 10px 30px rgba(0,0,0,0.04)`. This creates a subtle lift that suggests the UI elements are resting lightly on the surface.
- **Depth:** Overlapping elements (e.g., an image slightly breaking the boundary of a container) can be used to add a creative, "scrapbook" touch to the otherwise rigid grid.

## Shapes

The design system utilizes **Soft** geometry. While "Sharp" would feel too clinical and "Rounded" too playful, the **Soft** setting (4px to 12px radius) provides a sophisticated compromise that feels modern but approachable.

- **Buttons:** 4px radius for a sharp, tailored look.
- **Product Cards:** 8px radius to gently frame imagery.
- **Inputs:** 4px radius with a 1px border in Light Gray (#D1D1D6).

## Components

### Buttons
Primary buttons are Pure Black (#0D0D0D) with White text. On hover, the background transitions to the Gold (#C8A44D). Secondary buttons use a "Ghost" style: 1px Black border with a transparent background.

### Cards
Product cards should have no visible border. Use the ambient shadow on hover to indicate interactivity. Typography within cards should be strictly aligned: Category (Label-MD) in Gold, Product Name (Body-MD) in Black.

### Inputs
Minimalist design with no background color (transparent). A simple bottom-border that turns Gold on focus is the preferred elegant state for search and forms.

### Chips & Tags
Use for material types (e.g., "Organic Silk"). These should be styled with a Soft Gray background and Black text, using a Pill-shape (Rounded-XL) to differentiate them from functional buttons.

### Icons
Line-based icons with a 1px or 1.5px stroke weight. Avoid filled icons unless indicating an active state (e.g., a filled heart for "Favorited").