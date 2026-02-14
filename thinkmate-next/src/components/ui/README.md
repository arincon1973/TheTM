# UI Components Directory

This folder contains all reusable UI components for the ThinkMate landing page.

## 🎨 New Modular Components (Refactored)

### Core Components

#### Button.tsx
**Reusable button with variants and sizes**
- Primary variant (green background)
- Secondary variant (outline)
- Sizes: sm, md, lg
- Full-width option
- Hover effects and focus states

```tsx
<Button variant="primary" size="lg">Get Started</Button>
<Button variant="secondary" size="md">Learn More</Button>
```

#### Card.tsx
**Generic card container for UI elements**
- Flexible padding options
- Optional hover effects
- Dark mode support
- Clean shadows and borders

```tsx
<Card padding="lg" hover>
  <p>Card content</p>
</Card>
```

### Feature Components

#### FeatureCard.tsx
**Display features with icon, title, and description**
- Supports emoji or React node icons
- Centered layout with hover effect
- Fully responsive
- Dark mode support

```tsx
<FeatureCard
  icon="✏️"
  title="Smart Note-Taking"
  description="Organize your thoughts effortlessly"
/>
```

### Section Components

#### Hero.tsx (New)
**Hero section with background image and CTA**
- Customizable headline, subheadline, description
- Background image support
- Gradient overlay
- Integrated Button component
- Responsive typography

```tsx
<Hero
  headline="Welcome to ThinkMate"
  backgroundImage="/images/hero-bg.jpg"
  ctaText="Get Started"
  ctaHref="#contact"
/>
```

#### Pricing.tsx
**Pricing section with plan tiers**
- Multiple pricing plans
- Feature lists with checkmarks
- Highlighted "Popular" plan
- Responsive grid layout
- Integrated Button components

```tsx
<Pricing
  title="Choose Your Plan"
  tiers={[/* pricing data */]}
/>
```

#### Contact.tsx
**Contact form with validation**
- Name, email, message fields
- Real-time validation
- Error messages
- Success notification
- Loading states
- Dark mode support

```tsx
<Contact
  title="Get in Touch"
  subtitle="We'd love to hear from you"
/>
```

#### Footer.tsx (New)
**Site footer with links and branding**
- Navigation links
- Social media icons
- Brand section
- Responsive grid (1-3 columns)
- Auto-updating copyright year

```tsx
<Footer
  brandName="ThinkMate"
  links={[
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' }
  ]}
/>
```

## 📦 Legacy Components (Original)

These components are from the initial implementation and may be replaced by the new modular versions:

#### Hero.tsx (Original)
- Basic hero section
- Blue/purple gradient
- No background image support

#### Features.tsx (Original)
- Features section with scroll animation
- Intersection Observer
- Grid layout

#### ContactForm.tsx (Original)
- Contact form with validation
- Similar to new Contact.tsx

#### Navbar.tsx (Original)
- Navigation bar in root components folder
- Used for main navigation

## 🎯 Usage in page.tsx

```tsx
import Hero from '@/components/ui/Hero';
import FeatureCard from '@/components/ui/FeatureCard';
import Pricing from '@/components/ui/Pricing';
import Contact from '@/components/ui/Contact';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section id="features">
          <FeatureCard icon="✏️" title="..." description="..." />
          <FeatureCard icon="🤖" title="..." description="..." />
          <FeatureCard icon="☁️" title="..." description="..." />
        </section>
        
        {/* Pricing Section */}
        <Pricing />
        
        {/* Contact Section */}
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
```

## 🎨 Design System

### Colors
- **Primary:** Green-600 (#16a34a)
- **Hover:** Green-700
- **Text:** Gray-800 (light) / Gray-100 (dark)
- **Background:** White (light) / Gray-900 (dark)
- **Borders:** Gray-200 (light) / Gray-700 (dark)

### Typography
- **Headings:** Bold, extrabold weights
- **Body:** Normal weight, relaxed leading
- **Buttons:** Semibold

### Spacing
- **Section padding:** py-16 md:py-24
- **Card padding:** p-6 to p-8
- **Element gaps:** gap-4 to gap-8

### Responsive Breakpoints
- **Mobile:** < 768px (base)
- **Tablet:** 768px - 1024px (md:)
- **Desktop:** > 1024px (lg:)

## ✨ Component Features

### All Components Include:
- ✅ TypeScript interfaces
- ✅ Tailwind CSS styling
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Accessibility (ARIA labels)
- ✅ Hover and focus states
- ✅ Smooth transitions

### Button Component:
- 2 variants (primary, secondary)
- 3 sizes (sm, md, lg)
- Full-width option
- Disabled state
- Green theme

### Card Component:
- 3 padding sizes
- Optional hover effect
- Clickable option
- Shadow and border

### Form Components (Contact):
- Real-time validation
- Error messages
- Success notification
- Loading states
- Email regex validation

### Pricing Component:
- Multiple tiers
- Feature lists
- Highlighted plan badge
- Responsive grid
- Green CTA buttons

## 📝 TypeScript Interfaces

### Button
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### Card
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}
```

### FeatureCard
```typescript
interface FeatureCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  className?: string;
}
```

## 🚀 Quick Start

1. **Import a component:**
```tsx
import Button from '@/components/ui/Button';
```

2. **Use with props:**
```tsx
<Button variant="primary" size="lg">
  Click Me
</Button>
```

3. **Customize with className:**
```tsx
<Button className="mt-4">Custom Styles</Button>
```

## 🎯 Best Practices

1. **Use Button component** instead of raw buttons
2. **Wrap content in Card** for consistent styling
3. **Use FeatureCard** for feature displays
4. **Compose sections** from smaller components
5. **Pass props** to customize behavior
6. **Add className** for one-off styling

## 📖 Documentation

For complete documentation and examples, see:
- `REFACTORED_COMPONENTS.md` in project root
- TypeScript interfaces in component files
- Inline comments in component code

---

**All components are production-ready with full TypeScript support and dark mode! ✨**
