# EAC Education Platform - CSS System Documentation

**Phase 1a Foundation: Complete**

## 📁 CSS Files Structure

### Load Order (IMPORTANT - Cascading system)

```
1. css/variables.css     ← All CSS custom properties (colors, fonts, spacing)
2. css/base.css          ← Resets, typography, global styles
3. css/components.css    ← Buttons, cards, containers, badges
4. css/decorations.css   ← Fine lines, borders, hover effects, animations
5. css/responsive.css    ← Mobile-first breakpoints, media queries
```

**Why this order matters:**
- Variables are defined first so all other files can use them
- Base styles are applied before components
- Components can override base styles
- Decorations add layer of sophistication
- Responsive handles all breakpoints last

---

## 🎨 CSS Variables Reference

### Colors
```css
--navy-dark: #172334                /* Primary text, headings */
--navy-medium: #27415f              /* Secondary elements */
--slate: #506173                    /* Body text secondary */
--slate-light: #8192a5              /* Light text */
--blue-light: #d5dee7               /* Borders */
--accent-rose: #fca9a9              /* Primary accent, hover */
--accent-pink: #ffbde0              /* Secondary accent */
--accent-rose-light: #ffebf0        /* Tint backgrounds */
--bg-white: #ffffff                 /* Main background */
--bg-secondary: #f9fafb             /* Warm off-white */
--bg-tertiary: #f1f4f7              /* Cool gray-blue */
```

### Typography
```css
--font-serif-display: 'Cormorant Garamond', serif    /* Headings, large */
--font-serif-body: 'EB Garamond', serif              /* Body text */
--font-size-xs: 12px
--font-size-sm: 13px
--font-size-base: 15px
--font-size-md: 16px
--font-size-lg: 18px
--font-size-h4: 20px
--font-size-h3: 28px
--font-size-h2: 42px
--font-size-h1: 56px
```

### Spacing Scale
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-base: 16px
--spacing-lg: 20px
--spacing-xl: 24px
--spacing-2xl: 32px
--spacing-3xl: 40px
--spacing-4xl: 48px
--spacing-5xl: 60px
--spacing-6xl: 80px
```

### Borders & Shadows
```css
--border-main: 1px solid var(--blue-light)
--border-dark: 1px solid var(--slate)
--border-light: 1px solid #e9eff5

--shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.04)
--shadow-hover: 0 12px 36px rgba(23, 35, 52, 0.08)
--shadow-accent: 0 8px 24px rgba(252, 169, 169, 0.08)
```

---

## 🧩 Component Classes

### Buttons

**Default button:**
```html
<button class="btn">Click me</button>
```

**Variants:**
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
```

**Sizes:**
```html
<button class="btn btn-sm">Small</button>
<button class="btn">Default</button>
<button class="btn btn-lg">Large</button>
```

### Cards

**Basic card:**
```html
<div class="card">
  <h3>Title</h3>
  <p>Content goes here</p>
</div>
```

**With header and footer:**
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Subtitle</p>
  </div>
  <div class="card-body">
    <p>Body content</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

**Variants:**
```html
<div class="card card-elevated">Elevated</div>
<div class="card card-minimal">Minimal</div>
<div class="card card-accent">Accent Background</div>
```

### Badges

```html
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-accent">Accent</span>
<span class="badge badge-outline">Outline</span>
```

### Alerts

```html
<div class="alert alert-success">
  <div class="alert-title">Success</div>
  <div class="alert-message">Operation completed successfully</div>
</div>

<div class="alert alert-error">Error</div>
<div class="alert alert-warning">Warning</div>
<div class="alert alert-info">Info</div>
```

---

## 🎯 Typography Classes

### Headings (automatic with `<h1>` - `<h6>` tags)

```html
<h1>Large Heading (56px)</h1>
<h2>Medium Heading (42px)</h2>
<h3>Subheading (28px)</h3>
<h4>Smaller (20px)</h4>
<h5>Tiny (15px)</h5>
<h6>Mini (12px)</h6>
```

### Text Styles

```html
<p>Normal paragraph</p>
<small>Small text</small>
<strong>Bold text</strong>
<em>Emphasized text</em>
```

### Label / Caption

```html
<div class="label">UPPERCASE LABEL</div>
<div class="caption">Small caption text</div>
```

---

## 🎨 Decoration Classes

### Accent Lines

```html
<!-- Top border on hover -->
<div class="card line-accent-top">Content</div>

<!-- Left accent line -->
<div class="line-accent-left">Content</div>

<!-- Divider with accent -->
<div class="line-divider-bottom accent">Content</div>
```

### Separators

```html
<div class="separator"></div>
<div class="separator-thin"></div>
<div class="separator-accent"></div>
```

### Hover Effects

```html
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="hover-fade">Fades on hover</div>
```

---

## 📱 Responsive Utilities

### Show/Hide at Breakpoints

```html
<!-- Only show on mobile -->
<div class="show-mobile">Mobile only</div>

<!-- Hide on mobile, show on tablet+ -->
<div class="hide-mobile">Tablet and up</div>

<!-- Only show on desktop -->
<div class="show-desktop">Desktop only</div>
```

### Grid Systems

```html
<!-- 2-column grid (responsive) -->
<div class="grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 3-column grid -->
<div class="grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Auto-fit grid (responsive) -->
<div class="grid-auto">
  <div>Item</div>
  <div>Item</div>
</div>
```

### Flex Utilities

```html
<div class="flex gap-lg">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="flex-center">
  Centered content
</div>

<div class="flex-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 🎬 Animations

### Built-in Animations

```css
/* Fade in */
.fade-in { animation: fadeIn 0.4s ease-in-out; }

/* Slide from left */
.slide-in-left { animation: slideInLeft 0.4s ease-out; }

/* Slide from right */
.slide-in-right { animation: slideInRight 0.4s ease-out; }

/* Pulse */
.pulse { animation: pulse 2s ease-in-out infinite; }
```

---

## 📱 Breakpoints

- **Mobile (320px - 767px):** Base styles
- **Tablet (768px - 1023px):** 2-column layouts
- **Desktop (1024px - 1439px):** 3+ column layouts
- **Large Desktop (1440px+):** Full spacing

---

## ✅ Best Practices

### Do:
✅ Use CSS variables for consistency
✅ Use semantic HTML classes
✅ Follow responsive-first approach
✅ Stack CSS files in load order
✅ Use `var(--spacing-*)` for margins/padding
✅ Use decorative classes for visual enhancements

### Don't:
❌ Don't hardcode colors, use variables
❌ Don't use inline styles unless necessary
❌ Don't create new color names, use existing variables
❌ Don't duplicate CSS across files
❌ Don't break responsive order

---

## 🔧 Customization

### Adding New Colors

1. Add to `variables.css`:
```css
--color-new: #XXXXXX;
```

2. Use in components:
```css
.element {
  color: var(--color-new);
}
```

### Adding New Component

1. Create class in `components.css`
2. Use CSS variables for all values
3. Ensure responsive breakpoints are handled
4. Test on mobile, tablet, desktop

### Extending Typography

Edit `base.css` and `variables.css`:
- Font sizes
- Line heights
- Font weights
- Letter spacing

---

## 📊 File Sizes (Approximate)

- variables.css: 4KB
- base.css: 8KB
- components.css: 12KB
- decorations.css: 9KB
- responsive.css: 8KB
- **Total: ~41KB** (minified: ~25KB)

---

## 🚀 Next Phase (Phase 1b)

Phase 1b will build upon this foundation:
- Landing page layout with hero section
- Topic card grid layouts
- Form styling for auth pages
- Question engine interface
- Dashboard layouts

All using the CSS system established in Phase 1a.

---

**CSS System Status: ✅ Ready for Phase 1b**
