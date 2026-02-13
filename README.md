# 🎨 ColorLab Pro

**Advanced Color Mixer & Gradient Generator**

A professional-grade color design tool built with React that helps designers and developers create stunning color palettes, gradients, and harmonies. Features include WCAG contrast checking, image color extraction, and multi-format code export.

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### 🎯 Core Tools

#### 1. **Solid Color Mixer**
- Mix up to 7 colors simultaneously
- Real-time blended color preview
- RGB sliders for precise control
- HEX, RGB, and HSL output formats
- Interactive color cards with drag-and-drop

#### 2. **Gradient Generator**
- Create linear and radial gradients
- Up to 7 color stops
- Adjustable angle control (0-360°)
- **Animated gradients** with customizable speed
- One-click CSS export with keyframes
- Live preview with real-time updates

#### 3. **Color Harmony Generator**
- **Complementary** - Opposite colors on the wheel
- **Analogous** - Adjacent harmonious colors
- **Triadic** - 120° apart for vibrant palettes
- **Tetradic (Square)** - 90° apart for rich diversity
- **Monochromatic** - Same hue with varied lightness
- Click any color to copy to clipboard
- Based on color wheel theory using HSL color space

#### 4. **Color Scale Generator**
- Generate professional 50-900 shade scales
- Based on Tailwind CSS scale system
- Automatic lightness and saturation adjustments
- Export as CSS Variables or Tailwind Config
- Perfect for design systems

#### 5. **Image Color Extractor**
- Extract dominant colors from uploaded images
- Supports PNG, JPG, WebP (max 5MB)
- Drag-and-drop upload interface
- Canvas API for local processing (no external APIs)
- Top 5 palette colors with frequencies
- One-click color copying

#### 6. **Contrast Checker (WCAG 2.1 Compliant)**
- Real-time contrast ratio calculation
- WCAG AA and AAA compliance badges
- Normal text and large text validation
- **AI-powered accessible color suggestions**
- Live text preview with examples
- Relative luminance calculations
- Compliance level indicators

#### 7. **UI Preview Mode**
- Side-by-side light and dark theme preview
- Real UI components (navbar, buttons, cards, inputs)
- Live color palette editor
- Export palette as JSON
- Toggle switches for interactive testing
- Responsive design preview

#### 8. **Export Panel**
- **5 Export Formats:**
  - CSS Variables (`:root`)
  - SCSS Variables (`$variable`)
  - React Theme (ES6 export)
  - JSON
  - Tailwind Config (with shade scales)
- **Case Formatting Options:**
  - kebab-case
  - camelCase
  - snake_case
- Automatic shade scale generation (50-900)
- Color renaming and editing
- One-click copy or download
- Export full palette or primary color only

### 🚀 Additional Features

- **Dark/Light Theme Toggle** - Seamless theme switching with system preference detection
- **Save & Share** - Save palettes locally and generate shareable URLs
- **Recent Palettes** - Access your last 10 saved palettes
- **URL State Management** - Share palettes via URL parameters
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion
- **Accessible UI** - Keyboard navigation and ARIA labels

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.2.0** - Modern React with latest features
- **Vite 7.3.1** - Lightning-fast build tool and dev server
- **React DOM 19.2.0** - For rendering

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.24** - Vendor prefix automation
- **Framer Motion 12.34.0** - Animation library
- **Lucide React 0.563.0** - Beautiful icon library

### Utilities
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.4.0** - Merge Tailwind classes intelligently

### Development Tools
- **ESLint 9.39.1** - Code linting
- **Vite Plugin React 5.1.1** - Fast Refresh and JSX support

### Deployment
- **Vercel** - Optimized for production deployment
- Framework detection and automatic configuration

## 📁 Project Structure

```
ColorLab-Pro/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # React components
│   │   ├── ColorCard.jsx       # Individual color input card
│   │   ├── ColorHarmonyGenerator.jsx
│   │   ├── ColorScaleGenerator.jsx
│   │   ├── ContrastChecker.jsx
│   │   ├── ExportPanel.jsx
│   │   ├── GradientGenerator.jsx
│   │   ├── ImageColorExtractor.jsx
│   │   ├── PreviewPanel.jsx
│   │   ├── SaveSharePanel.jsx
│   │   ├── SolidMixer.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── UIPreview.jsx
│   │   └── preview/            # UI Preview components
│   │       ├── ModePreview.jsx
│   │       ├── PreviewButton.jsx
│   │       ├── PreviewCard.jsx
│   │       ├── PreviewInput.jsx
│   │       ├── PreviewNavbar.jsx
│   │       └── PreviewToggle.jsx
│   ├── context/                # React Context
│   │   └── ThemeContext.jsx    # Theme state management
│   ├── layouts/                # Layout components
│   │   └── MainLayout.jsx      # Main app layout
│   ├── utils/                  # Utility functions
│   │   ├── colorUtils.js       # Color conversion & generation
│   │   ├── exportUtils.js      # Code export utilities
│   │   ├── wcagUtils.js        # WCAG contrast calculations
│   │   └── urlStateUtils.js    # URL state management
│   ├── App.css                 # Component styles
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles & theme variables
│   └── main.jsx                # App entry point
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vercel.json                 # Vercel deployment config
└── vite.config.js              # Vite configuration
```

## 🎨 Key Utilities Explained

### colorUtils.js
**Core color manipulation utilities**

```javascript
// Color Space Conversions
hexToRgb(hex)                   // HEX → RGB
rgbToHex(r, g, b)               // RGB → HEX
rgbToHsl(r, g, b)               // RGB → HSL
hslToRgb(h, s, l)               // HSL → RGB
hexToHsl(hex)                   // HEX → HSL
hslToHex(h, s, l)               // HSL → HEX

// Color Blending
blendColors(colors)             // Average multiple colors

// Gradient Generation
generateGradientCSS(type, angle, colors)
generateAnimatedGradientCSS(colors, angle, duration)

// Color Scales
generateColorScale(baseHex)     // Generate 50-900 scale

// Image Extraction
extractColorsFromImage(file, sampleSize)

// Color Harmonies
generateComplementary(baseHex)
generateAnalogous(baseHex)
generateTriadic(baseHex)
generateTetradic(baseHex)
generateMonochromatic(baseHex)
generateAllHarmonies(baseHex)
```

### exportUtils.js
**Multi-format code export utilities**

```javascript
// Export Generators
generateCSSVariables(palette, caseFormat)
generateSCSSVariables(palette, caseFormat)
generateReactTheme(palette, caseFormat)
generateJSON(palette, caseFormat)
generateTailwindConfig(palette, caseFormat)

// Shade Generation
generateShadeScale(baseHex)     // Generates 50-900 shades

// Clipboard
copyToClipboard(text)           // Cross-browser clipboard API
```

### wcagUtils.js
**WCAG 2.1 accessibility utilities**

```javascript
// Luminance & Contrast
getRelativeLuminance(hex)       // Calculate relative luminance
getContrastRatio(fg, bg)        // Calculate contrast ratio (1-21)
formatContrastRatio(ratio)      // Format as "4.52:1"

// WCAG Compliance
checkWCAGCompliance(ratio)      // Check AA/AAA for normal/large text
getComplianceLevel(ratio)       // Returns 'AAA', 'AA', or 'FAIL'
getContrastDescription(ratio)   // Human-readable description

// Color Suggestions
suggestAccessibleColor(fg, bg, targetRatio)  // AI-powered suggestions
```

### urlStateUtils.js
**State persistence and sharing**

```javascript
// URL Encoding/Decoding
encodeStateToURL(state)
decodeStateFromURL(encoded)
saveStateToURL(state)
loadStateFromURL()
generateShareableLink(state)

// Local Storage
saveToLocalStorage(key, value)
loadFromLocalStorage(key)
getRecentPalettes(limit)
saveToRecentPalettes(palette)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vaibhavchauhan-15/ColorLab-Pro.git

# Navigate to project directory
cd ColorLab-Pro

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🎯 Usage Examples

### Creating a Color Palette

1. **Navigate to Solid Mixer**
2. Click "Add Color" to add up to 7 colors
3. Adjust colors using:
   - Color picker
   - HEX input
   - RGB sliders
4. View the blended result in real-time
5. Export in your preferred format

### Generating Harmonies

1. **Go to Harmony tab**
2. Select a base color
3. View all 5 harmony types automatically
4. Click any color to copy
5. Use harmonies directly in your design system

### Creating Animated Gradients

1. **Navigate to Gradient tab**
2. Add 2-7 colors
3. Toggle "Animate Gradient"
4. Adjust animation speed (1-10s)
5. Click "Copy Animation Code" to get CSS + keyframes

### Checking Accessibility

1. **Go to Contrast Checker**
2. Select foreground and background colors
3. View real-time contrast ratio
4. Check WCAG AA/AAA compliance
5. Apply suggested accessible alternatives

### Extracting Colors from Images

1. **Navigate to Image Extract tab**
2. Drag and drop an image (or click to upload)
3. View dominant color and top 5 palette
4. Click any color to copy

## 🎨 Color Themes

ColorLab Pro features two beautifully crafted themes:

### Light Mode - "Soft Frost"
- Background: `#F8FAFC`
- Card: `#FFFFFF`
- Accent: `#4F46E5`
- Text: `#0F172A`

### Dark Mode - "Midnight Studio"
- Background: `#0B1120`
- Card: `#0F172A`
- Accent: `#6366F1`
- Text: `#F8FAFC`

## 🔧 Configuration

### Tailwind Configuration

ColorLab Pro uses a custom Tailwind setup with CSS variables for theming:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      card: "hsl(var(--card))",
      accent: "hsl(var(--accent))",
      text: "hsl(var(--text))",
      // ... more custom colors
    }
  }
}
```

### Vite Configuration

Simple, fast configuration optimized for React:

```javascript
export default defineConfig({
  plugins: [react()],
})
```

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Adaptive Layouts** - Components adjust across screen sizes
- **Touch Friendly** - Large tap targets for mobile

## ♿ Accessibility Features

- **WCAG 2.1 Compliant** - Meets accessibility standards
- **Keyboard Navigation** - Full keyboard support
- **ARIA Labels** - Proper screen reader support
- **Reduced Motion** - Respects user motion preferences
- **Focus Indicators** - Clear focus states
- **Color Contrast** - All UI elements meet AA standards

## 🎭 Animation System

Powered by Framer Motion for smooth, performant animations:

- **Page Transitions** - Smooth tab switching
- **Layout Animations** - Intelligent layout transitions
- **Hover Effects** - Interactive micro-interactions
- **Load Animations** - Staggered content reveal
- **Gesture Support** - Drag, tap, and hover

## 📦 Build & Deployment

### Production Build

```bash
npm run build
# Output: dist/
```

### Deployment on Vercel

The project includes `vercel.json` for optimal deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Deploy Steps:**
1. Connect repository to Vercel
2. Auto-detection of Vite framework
3. Automatic builds on push
4. Production URL generated

## 🧪 Browser Support

- **Chrome/Edge** - Latest 2 versions ✅
- **Firefox** - Latest 2 versions ✅
- **Safari** - Latest 2 versions ✅
- **Mobile Safari** - iOS 13+ ✅
- **Chrome Android** - Latest ✅

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use ESLint for linting
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vaibhav Chauhan** ([@vaibh](https://github.com/vaibhavchauhan-15))

## 🙏 Acknowledgments

- **Tailwind CSS** - For the amazing utility-first framework
- **Framer Motion** - For smooth animations
- **Lucide** - For beautiful icons
- **Vite** - For lightning-fast development
- **React Team** - For the awesome framework

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Components:** 20+
- **Utilities:** 50+ functions
- **Export Formats:** 5
- **Color Harmonies:** 5 types
- **WCAG Levels:** AA & AAA

## 🗺️ Roadmap

### Upcoming Features

- [ ] Color blindness simulator
- [ ] Custom gradient presets library
- [ ] PNG/SVG gradient export
- [ ] Color palette history timeline
- [ ] AI-powered palette generation
- [ ] Collaborative palette sharing
- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] API for programmatic access
- [ ] VS Code extension

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Space` - Toggle theme
- `Tab` - Navigate between inputs
- `Enter` - Apply color changes
- `Esc` - Close modals

### Pro Tips
1. **Use URL Sharing** - Share palettes instantly with collaborators
2. **Save Frequently** - Use "Save Palette" to build a library
3. **Start with Harmony** - Generate harmonies first, then refine
4. **Check Contrast Early** - Validate accessibility from the start
5. **Export Scale** - Generate full Tailwind scales for consistency

## 🐛 Known Issues

- Image extractor works best with high-contrast images
- Very light colors may show minimal contrast in light mode
- Animated gradients require CSS animation support

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/vaibhavchauhan-15/ColorLab-Pro/issues)
- **Discussions** - [GitHub Discussions](https://github.com/vaibhavchauhan-15/ColorLab-Pro/discussions)

## 🌟 Star History

If you find ColorLab Pro helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by Vaibhav Chauhan**

*ColorLab Pro - Where Colors Come to Life* 🎨
