# ThinkMate Next.js Landing Page

A modern, responsive landing page for ThinkMate - an AI-powered note-taking and writing assistant. Built with Next.js 14, React, TypeScript, and Tailwind CSS v4.

**Converted from static HTML/CSS/JavaScript to a full-stack Next.js application.**

## 📁 Project Structure

```
thinkmate-next/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main landing page (assembles all components)
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── globals.css        # Global styles + Tailwind CSS imports
│   │   └── favicon.ico        # Favicon
│   └── components/
│       └── ui/
│           ├── Navbar.tsx         # Navigation header with dark mode toggle
│           ├── Hero.tsx           # Hero section with CTA
│           ├── Features.tsx       # Features grid with scroll animations
│           ├── ContactForm.tsx    # Contact form with validation
│           ├── Footer.tsx         # Footer with links
│           └── README.md          # Components documentation
├── public/                # Static assets
├── railway.json           # Railway deployment configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.mjs     # PostCSS configuration for Tailwind
└── README.md              # This file
```

## ✨ Features

### Frontend Framework
- **Next.js 14+** with App Router
- **React 18+** with Client Components
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling

### Interactive Features
All features from the static version, now with React:
- ✅ **Dark Mode Toggle** - Persistent theme with localStorage
- ✅ **Responsive Navigation** - Mobile-friendly hamburger menu
- ✅ **Form Validation** - Real-time validation with error messages
- ✅ **Scroll Animations** - Intersection Observer for fade-in effects
- ✅ **Smooth Scrolling** - Enhanced navigation
- ✅ **Accessibility** - ARIA labels, keyboard navigation

### React Patterns Used
- **Hooks**: useState, useEffect, useRef
- **Controlled Components**: Form inputs managed by React state
- **Event Handlers**: onClick, onChange, onSubmit
- **Conditional Rendering**: Dynamic UI based on state
- **Component Composition**: Modular, reusable components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Navigate to the project folder**:
   ```bash
   cd thinkmate-next
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Tailwind Theme
Edit `src/app/globals.css` to customize colors and themes:

```css
:root {
  --primary: #3b82f6;    /* Primary blue */
  --secondary: #8b5cf6;  /* Secondary purple */
  /* ... more colors */
}
```

### Components
Each component is in `src/components/ui/` folder:
- **Navbar.tsx** - Header and navigation
- **Hero.tsx** - Landing banner
- **Features.tsx** - Feature cards grid
- **ContactForm.tsx** - Contact form
- **Footer.tsx** - Page footer

### Content
Edit `src/app/page.tsx` and individual component files in `src/components/ui/` to update text, links, and structure.

## 📚 CSS to Tailwind Conversion Reference

This project demonstrates converting raw CSS to Tailwind classes. Here are key mappings:

| CSS Property | Tailwind Class | Example Usage |
|-------------|---------------|---------------|
| `display: flex` | `flex` | Layout containers |
| `display: grid` | `grid` | Features section |
| `justify-content: center` | `justify-center` | Centering content |
| `align-items: center` | `items-center` | Vertical alignment |
| `margin: 1rem` | `m-4` | Spacing (1 = 0.25rem) |
| `padding: 1rem` | `p-4` | Internal spacing |
| `font-size: 2.25rem` | `text-4xl` | Large headings |
| `font-weight: 700` | `font-bold` | Bold text |
| `background-color: #3B82F6` | `bg-blue-500` | Primary color |
| `color: #1F2937` | `text-gray-800` | Text color |
| `border-radius: 8px` | `rounded-lg` | Rounded corners |
| `box-shadow: medium` | `shadow-md` | Drop shadows |
| `transition: all 0.3s` | `transition-all duration-300` | Smooth animations |
| `max-width: 1200px` | `max-w-7xl` | Container width |
| `gap: 1rem` | `gap-4` | Flex/Grid spacing |
| `@media (max-width: 768px)` | `md:` prefix | Responsive breakpoints |
| `opacity: 0.9` | `opacity-90` | Transparency |
| `transform: translateY(-5px)` | `hover:-translate-y-1.5` | Hover effects |
| `z-index: 1000` | `z-[1000]` | Stacking order |
| `line-height: 1.6` | `leading-relaxed` | Text line height |
| `text-align: center` | `text-center` | Text alignment |

**See `src/app/page.tsx` for detailed 35-point CSS-to-Tailwind mapping with examples.**

## 🔄 JavaScript to React Conversion

Key conversions from vanilla JavaScript:

| Vanilla JS | React Pattern | Notes |
|-----------|--------------|-------|
| `let variable = value` | `useState(value)` | State management |
| `document.querySelector()` | `useRef()` | DOM references |
| `addEventListener('click')` | `onClick={handler}` | Event handling |
| `input.value` | Controlled component | Two-way binding |
| `classList.toggle()` | Conditional className | Dynamic classes |
| `window.onload` | `useEffect(() => {}, [])` | Initialization |
| `localStorage` | Same in useEffect | Persistent storage |
| `new IntersectionObserver()` | useEffect + useRef | Scroll detection |
| `setTimeout()` | Same in React | Delayed execution |
| Form validation | State + functions | Validation logic |

## 🚂 Deploy to Railway

### Option 1: Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize and deploy**:
   ```bash
   railway init
   railway up
   ```

### Option 2: Railway Dashboard

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Railway automatically detects `railway.json` and deploys
5. Your site is live! 🎉

### Option 3: Deploy from GitHub

1. Push code to GitHub
2. In Railway, select "Deploy from GitHub"
3. Select your repository
4. Railway builds and deploys automatically

### Environment Variables

For production, add environment variables in Railway dashboard:
- See `.env.example` for available variables
- Update as your project grows (API keys, database URLs, etc.)

## 🔧 Railway Configuration

The `railway.json` file configures deployment:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

- **Builder**: NIXPACKS (automatic detection)
- **Build**: Runs `npm run build` to create optimized production build
- **Start**: Runs `npm start` to serve the application
- **Restart Policy**: Automatically restarts on failure

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:

- **Mobile**: < 768px (base styles)
- **Tablet**: 768px - 1024px (md: prefix)
- **Desktop**: > 1024px (lg: prefix)

Tailwind uses a **mobile-first** approach:
- Base classes apply to mobile
- Add `md:` prefix for tablet+
- Add `lg:` prefix for desktop+

## 🎯 Key Technologies

- **Next.js 14+**: React framework with App Router
- **React 18+**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS v4**: Utility-first CSS framework
- **PostCSS**: CSS processing for Tailwind

## 🌟 Features Highlight

### Dark Mode
- Toggle between light and dark themes
- Persistent with localStorage
- Uses Tailwind's `dark:` prefix for styling
- Automatic system preference detection

### Form Validation
- Real-time validation as user types
- Email format checking with RegEx
- Minimum length requirements
- Clear error messages
- Success notification after submission

### Scroll Animations
- Intersection Observer API for performance
- Fade-in effect when features section enters viewport
- Smooth scroll navigation to sections

### Mobile Navigation
- Hamburger menu on mobile devices
- Animated menu toggle
- Closes automatically when link is clicked
- Responsive to window resize

## 📖 Learning Resources

This project is excellent for learning:

1. **Next.js App Router** - Modern Next.js patterns
2. **React Hooks** - useState, useEffect, useRef
3. **TypeScript with React** - Type-safe components
4. **Tailwind CSS** - Utility-first CSS approach
5. **Responsive Design** - Mobile-first methodology
6. **Component Architecture** - Modular design
7. **Form Handling** - Controlled components
8. **Accessibility** - ARIA labels, semantic HTML
9. **Performance** - Code splitting, lazy loading
10. **Deployment** - Railway hosting

## 🐛 Troubleshooting

### Development Issues

**Issue**: Port 3000 is already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or run on a different port
PORT=3001 npm run dev
```

**Issue**: Types not updating
```bash
# Delete .next folder and rebuild
rm -rf .next
npm run dev
```

### Build Issues

**Issue**: Build fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

This is a learning project. Feel free to:
- Fork the repository
- Create new features
- Improve documentation
- Share improvements

## 📞 Support

For questions about ThinkMate, use the contact form on the landing page.

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**

*Converted from static HTML/CSS/JavaScript to showcase modern web development practices and the power of React and Tailwind CSS.*

## 🔗 Related Files

- **Static Version**: See `../thinkmate-static/` for the original HTML/CSS/JS version
- **Comparison**: Both versions have identical functionality and design
- **Learning Path**: Start with static version, then study Next.js conversion

## 🎓 Educational Value

This project demonstrates:
- ✅ Static HTML → React component conversion
- ✅ CSS → Tailwind CSS migration
- ✅ Vanilla JS → React hooks refactoring
- ✅ Form handling evolution
- ✅ State management patterns
- ✅ Modern deployment practices

Perfect for developers transitioning from traditional web development to modern React-based applications!
# Thinkmate
# Thinkmate
