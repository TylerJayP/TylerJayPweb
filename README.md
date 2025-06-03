# Tyler Jay Perkins - Portfolio Website

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tylerjayp.com-blue)](https://www.tylerjayp.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.4-ff69b4?logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive portfolio website built with React and Framer Motion, showcasing my skills, projects, and experience as a Computer Science student and developer.

## Features

### **Modern Design & Animations**
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works seamlessly on all devices
- **Dark/Light theme toggle** with persistent user preference
- **Interactive navigation** with smooth scrolling and section highlighting
- **Glassmorphism effects** and modern UI design patterns

### **Mobile-First Experience**
- **Floating mobile navigation** with animated hamburger menu
- **Touch-friendly interactions** optimized for mobile devices
- **Responsive breakpoints** ensuring perfect display on any screen size
- **Progressive Web App** features for enhanced mobile experience

### **Interactive Resume**
- **Downloadable PDF resume** with professional formatting
- **Print-optimized styling** for clean paper output
- **Real-time resume updates** reflecting current experience
- **Interactive sections** with smooth reveal animations

### **Project Showcase**
- **Featured projects** with live demos and source code links
- **Technology tags** highlighting the tech stack used
- **Project descriptions** with detailed feature explanations
- **Hover effects** and interactive project cards

### **Contact Integration**
- **Contact form** with form validation and user feedback
- **Social media links** to LinkedIn, GitHub, and email
- **Professional presentation** of contact information
- **Responsive layout** for optimal user experience

## Tech Stack

### **Frontend Framework**
- **React 18.2.0** - Modern component-based architecture
- **React Router** - Client-side routing for SPA experience
- **React Intersection Observer** - Scroll-triggered animations

### **Animation & UI**
- **Framer Motion 10.16.4** - Production-ready motion library
- **Lucide React** - Beautiful, customizable icons
- **CSS3** - Modern styling with custom properties and animations

### **Development Tools**
- **React Scripts 5.0.1** - Zero-configuration build setup
- **ESLint** - Code quality and consistency
- **Modern JavaScript (ES6+)** - Latest language features

### **Performance & Optimization**
- **Code splitting** - Optimized bundle sizes
- **Lazy loading** - Efficient resource loading
- **Responsive images** - Optimized for all screen sizes
- **PWA-ready** - Service worker support for offline functionality

## Design Features

### **Visual Elements**
- **Animated typing effect** in hero section
- **Scrolling tech stack showcase** with smooth infinite scroll
- **Interactive project cards** with hover effects and overlays
- **Smooth page transitions** between sections

### **Theme System**
- **Dynamic theme switching** with CSS custom properties
- **Persistent theme preference** using localStorage
- **Smooth theme transitions** with CSS animations
- **Accessible color contrast** in both themes

### **Responsive Design**
- **Mobile-first approach** ensuring great mobile experience
- **Flexible grid layouts** that adapt to any screen size
- **Touch-friendly interface** with appropriate touch targets
- **Optimized typography** for readability across devices

## Project Structure

```
src/
├── components/           # React components
│   ├── About.js         # About section with tech stack
│   ├── Contact.js       # Contact form and social links
│   ├── Hero.js          # Landing section with typing animation
│   ├── Navbar.js        # Navigation with mobile menu
│   ├── Projects.js      # Project showcase grid
│   ├── Resume.js        # Interactive resume with PDF download
│   └── ThemeToggle.js   # Theme switching component
├── hooks/               # Custom React hooks
│   └── useTheme.js      # Theme management hook
├── styles/              # CSS styling
│   ├── App.css          # Global app styles
│   └── index.css        # Base styles and CSS variables
└── App.js               # Main application component
```

## Installation & Setup

### **Prerequisites**
- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/TylerJayP/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the portfolio

### **Build for Production**

```bash
# Create optimized production build
npm run build

# Serve the build locally (optional)
npx serve -s build
```

## Deployment

The portfolio is deployed and accessible at [tylerjayp.com](https://www.tylerjayp.com/)

### **Deployment Options**

#### **Netlify (Recommended)**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on every push

#### **Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the deployment prompts

#### **GitHub Pages**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://username.github.io/repository-name"`
3. Add deploy script: `"deploy": "gh-pages -d build"`
4. Run: `npm run deploy`

## Key Projects Featured

### **Personal Mood Journal**
- **Technologies**: React, React Router, CSS3, Local Storage, Speech-to-Text API
- **Features**: Daily mood tracking, journal entries, analytics, photo integration
- **Live Demo**: [personalmoodjournal.netlify.app](https://personalmoodjournal.netlify.app)

### **Virtual Dyno Pro**
- **Technologies**: C# ASP.NET Core, Entity Framework, React, Chart.js
- **Features**: Automotive dyno analysis, CSV processing, real-world calibration
- **Repository**: [github.com/TylerJayP/VirtualDyno](https://github.com/TylerJayP/VirtualDyno)

### **Personal Portfolio**
- **Technologies**: React, Framer Motion, CSS3, JavaScript
- **Features**: Modern animations, responsive design, theme toggle, PDF resume
- **Live Demo**: [tylerjayp.com](https://www.tylerjayp.com/)

## Customization

### **Personal Information**
Update personal details in the following components:
- `src/components/Hero.js` - Name and introduction
- `src/components/About.js` - About section content
- `src/components/Resume.js` - Resume information
- `src/components/Contact.js` - Contact information

### **Projects**
Modify the projects array in `src/components/Projects.js`:
```javascript
const projects = [
  {
    title: "Your Project Title",
    description: "Project description...",
    tech: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/username/repo",
    live: "https://your-project.com",
    image: "path/to/image.jpg"
  }
];
```

### **Theme Colors**
Customize theme colors in `src/styles/index.css`:
```css
:root {
  --accent-primary: #your-color;
  --accent-secondary: #your-secondary-color;
  /* Add more custom colors */
}
```

### **Typography**
The portfolio uses **Poppins** font from Google Fonts. To change:
1. Update the font import in `public/index.html`
2. Modify the font-family in `src/styles/index.css`

## Performance Optimizations

- **Code splitting** with React.lazy() for improved load times
- **Image optimization** with WebP format and responsive sizing
- **CSS optimization** with custom properties and efficient selectors
- **Bundle analysis** available with `npm run build` and source map explorer

## SEO Features

- **Meta tags** for social media sharing
- **Structured data** for search engines
- **Semantic HTML** for better accessibility
- **Alt text** for all images
- **Clean URLs** with React Router

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Tyler Jay Perkins**
- **Website**: [tylerjayp.com](https://www.tylerjayp.com/)
- **Email**: [tylerjayp12@gmail.com](mailto:tylerjayp12@gmail.com)
- **LinkedIn**: [linkedin.com/in/tylerjayperkins](https://www.linkedin.com/in/tylerjayperkins/)
- **GitHub**: [github.com/TylerJayP](https://github.com/TylerJayP)

---
