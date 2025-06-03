import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Tyler Jay Perkins';

  useEffect(() => {
    if (inView) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [inView]);

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="hero-greeting">Hi, I'm</h2>
          <h1 className="hero-name">
            <span className="name-colored">{displayText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-description">
            Currently a Senior studying <span className="highlight">Computer Science</span> at Utah Valley University
          </p>
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="cta-button primary"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(193, 155, 166, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
          </motion.button>
          
          <motion.button
            className="cta-button secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
