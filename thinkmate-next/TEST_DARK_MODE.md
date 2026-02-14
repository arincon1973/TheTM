# Dark Mode Testing Guide

## Quick Test Commands

```bash
# Start dev server
cd thinkmate-next
npm run dev
```

## Manual Testing Steps

### 1. Open Developer Tools
- Press F12 or Cmd+Opt+I
- Go to Console tab

### 2. Test localStorage
```javascript
// Check current value
localStorage.getItem('darkMode')

// Manually enable dark mode
localStorage.setItem('darkMode', 'enabled')
location.reload()

// Manually disable dark mode
localStorage.setItem('darkMode', 'disabled')
location.reload()

// Clear and test
localStorage.clear()
location.reload()
```

### 3. Inspect HTML Element
- In Elements tab, click on `<html>` element
- When dark mode is ON, you should see: `<html lang="en" class="dark">`
- When dark mode is OFF, no `dark` class should be present

### 4. Visual Check

**Light Mode Should Show:**
- White background
- Dark text
- Light navbar
- Light gray sections

**Dark Mode Should Show:**
- Dark gray background (#111827)
- Light text
- Dark navbar
- Darker gray sections

### 5. Toggle Button Check
- Click the moon/sun icon in navbar
- Page should change immediately
- Background should transition smoothly
- Refresh page - theme should persist

## Debugging

### Check if Script Loaded
```javascript
// In console, check if dark class is being added
document.documentElement.classList.contains('dark')
```

### Check Tailwind Config
The config should have:
```typescript
darkMode: "class"
```

### Check Component Classes
All components should have `dark:` prefixed classes:
- `bg-white dark:bg-gray-900`
- `text-gray-900 dark:text-gray-100`
- etc.

## Common Issues

### Issue: Toggle clicks but nothing happens
**Check:**
1. Console for errors
2. `document.documentElement.classList` to see if 'dark' is added
3. Component classes have `dark:` prefixes

### Issue: Flash of wrong theme on load
**Check:**
1. Script with `beforeInteractive` strategy is in layout.tsx
2. `suppressHydrationWarning` is on `<html>` element

### Issue: Theme doesn't persist
**Check:**
1. localStorage is working (not in incognito mode)
2. DarkModeToggle is saving to localStorage
3. Script is reading from localStorage on load

## Expected Behavior

1. **First Visit:** Uses system preference or defaults to light
2. **Click Toggle:** Changes theme immediately, saves to localStorage
3. **Refresh Page:** Loads saved preference, no flash
4. **Open in New Tab:** Uses saved preference

## Files to Check

1. `src/app/layout.tsx` - Script and suppressHydrationWarning
2. `src/components/DarkModeToggle.tsx` - Toggle logic
3. `src/app/globals.css` - Dark mode CSS variables
4. `tailwind.config.ts` - darkMode: "class"
5. All components - Have `dark:` classes

## Test Checklist

- [ ] Click toggle button
- [ ] See background change
- [ ] See text color change
- [ ] Refresh page
- [ ] Theme persists
- [ ] No console errors
- [ ] Smooth transitions
- [ ] All sections change (navbar, hero, features, etc.)
