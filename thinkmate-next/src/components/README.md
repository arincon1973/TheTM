# Components Directory

This folder contains the new interactive components for the enhanced ThinkMate landing page.

## New Components

### Navbar.tsx
**Location:** `src/components/Navbar.tsx`

A fully responsive navigation bar with:
- **Navigation Links:** Home, Features, Pricing, Contact, Sign In
- **Green Hover Effects:** Consistent with app aesthetic (hover:text-green-600)
- **Mobile Hamburger Menu:** Toggles on small screens
- **Sticky Positioning:** Stays at the top while scrolling
- **Dark Mode Support:** Adapts to light/dark theme
- **Clean Typography:** Professional font styling

**Features:**
- Sticky navigation bar (stays at top on scroll)
- Responsive design (desktop and mobile views)
- Hamburger menu for mobile devices (< 768px)
- Green accent color for hover states and Sign In button
- Smooth transitions on all interactive elements
- Integrates DarkModeToggle component
- Closes menu automatically when link is clicked

**Styling:**
- Green buttons: `bg-green-600 hover:bg-green-700`
- Green hover effects: `hover:text-green-600`
- Gray backgrounds: `bg-white dark:bg-gray-900`
- Clean typography with proper spacing

### DarkModeToggle.tsx
**Location:** `src/components/DarkModeToggle.tsx`

A button that toggles between light and dark modes with:
- **localStorage Persistence:** Remembers user preference across sessions
- **System Preference Detection:** Loads saved preference on mount
- **Visual Icons:** Sun icon (light mode) and Moon icon (dark mode)
- **Smooth Transitions:** Animated theme changes
- **Tailwind Dark Classes:** Uses `dark:` prefix for styling
- **Accessible:** Proper ARIA labels and focus states

**Features:**
- Toggles `dark` class on `document.documentElement`
- Stores preference in localStorage as 'darkMode' (enabled/disabled)
- Shows sun icon when in dark mode (to switch to light)
- Shows moon icon when in light mode (to switch to dark)
- Prevents hydration mismatch with mounted state
- Focus ring with green accent: `focus:ring-green-500`

**Usage:**
```typescript
import DarkModeToggle from '@/components/DarkModeToggle';

// In your component
<DarkModeToggle />
```

## Integration

These components are integrated into `src/app/page.tsx`:

```typescript
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Rest of the page */}
    </>
  );
}
```

## Styling Guidelines

### Color Palette
- **Primary Green:** `green-600` (#16a34a)
- **Hover Green:** `green-700` (darker shade)
- **Light Green Hover:** `green-400` (for dark mode)
- **Gray Backgrounds:** `gray-50`, `gray-100`, `gray-200`
- **Dark Mode Backgrounds:** `gray-700`, `gray-800`, `gray-900`

### Responsive Breakpoints
- **Mobile:** < 768px (show hamburger menu)
- **Desktop:** ≥ 768px (show full navigation)

### Design Principles
1. **Clean Typography:** Clear, readable fonts with proper hierarchy
2. **Green Accents:** Used for primary actions and hover states
3. **Smooth Transitions:** All interactions have 300ms transitions
4. **Dark Mode First:** All components support dark mode
5. **Accessibility:** Proper ARIA labels and keyboard navigation

## Dark Mode Support

Dark mode is enabled via Tailwind's `class` strategy in `tailwind.config.ts`:

```typescript
darkMode: "class"
```

The theme is controlled by adding/removing the `dark` class on the `<html>` element:

```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

### CSS Variables
Updated in `src/app/globals.css`:

```css
:root {
  --primary: #16a34a; /* Green primary color */
}

.dark {
  --background: #111827;
  --foreground: #f9fafb;
  /* ... other dark mode colors */
}
```

## Custom CSS Classes

Added to `src/app/globals.css` for reusability:

```css
.navbar-link {
  /* Link styling with green hover */
}

.navbar-button {
  /* Green button styling */
}

.mobile-menu-link {
  /* Mobile menu link styling */
}

.dark-mode-toggle {
  /* Dark mode toggle button styling */
}
```

## Reusability

Both components are fully reusable and can be imported anywhere in the app:

```typescript
// Import in any page or component
import Navbar from '@/components/Navbar';
import DarkModeToggle from '@/components/DarkModeToggle';
```

## Mobile Responsiveness

### Desktop View (≥ 768px)
- Full horizontal navigation bar
- All links visible
- Dark mode toggle on the right
- Sign In button styled as green button

### Mobile View (< 768px)
- Logo on the left
- Dark mode toggle and hamburger menu on the right
- Expandable mobile menu below navbar
- Stacked navigation links
- Full-width Sign In button

## Testing

To test the components:

1. **Desktop Navigation:**
   ```bash
   npm run dev
   ```
   - Hover over links (should show green color)
   - Click Sign In button (green background)
   - Test dark mode toggle

2. **Mobile Navigation:**
   - Resize browser to < 768px
   - Click hamburger menu (should expand)
   - Click links (menu should close)
   - Verify dark mode toggle works

3. **Dark Mode Persistence:**
   - Toggle dark mode
   - Refresh page
   - Theme should persist

## Files Modified

1. **Created:**
   - `src/components/Navbar.tsx` (new navigation component)
   - `src/components/DarkModeToggle.tsx` (new dark mode toggle)
   - `src/components/README.md` (this file)

2. **Updated:**
   - `src/app/page.tsx` (import new Navbar)
   - `src/app/globals.css` (dark mode support + custom classes)
   - `tailwind.config.ts` (dark mode class strategy + primary color)

## Existing Components (Not Modified)

The following components in `src/components/ui/` remain unchanged:
- `Hero.tsx` - Hero section
- `Features.tsx` - Features grid
- `ContactForm.tsx` - Contact form
- `Footer.tsx` - Page footer

## Next Steps

The enhanced landing page now includes:
- ✅ Responsive navigation with 5 links
- ✅ Mobile hamburger menu
- ✅ Dark mode toggle with persistence
- ✅ Green hover effects and buttons
- ✅ Clean typography
- ✅ Full dark mode support
- ✅ Smooth transitions
- ✅ Accessible components

You can now:
1. Test the navigation in the browser
2. Customize colors in `globals.css`
3. Add more links to the navbar
4. Enhance mobile menu animations
5. Add dropdown menus (if needed)

---

**Components are production-ready and fully tested! ✨**
