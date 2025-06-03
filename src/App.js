import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, toggleTheme] = useTheme();

  const renderSection = () => {
    switch(activeSection) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'resume':
        return <Resume />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {activeSection === 'hero' ? (
          <>
            <Hero />
            <About />
            <Projects />
            <Contact />
          </>
        ) : (
          renderSection()
        )}
      </motion.main>
    </div>
  );
}

export default App;
