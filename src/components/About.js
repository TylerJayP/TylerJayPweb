import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, GraduationCap, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  // Tech stack with logo URLs from devicons CDN
  const techStack = [
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C#', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'HTML/CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' }
  ];

  // Duplicate the array for seamless infinite scrolling
  const duplicatedTechStack = [...techStack, ...techStack, ...techStack];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 className="section-title" variants={itemVariants}>
            About Me
          </motion.h2>

          <div className="about-grid">
            <motion.div className="about-text" variants={itemVariants}>
              <div className="about-card">
                <div className="card-header">
                  <Code className="card-icon" />
                  <h3>Passionate Developer</h3>
                </div>
                <p>
                  I love creating digital experiences that matter. From web applications 
                  to complex algorithms, I enjoy the process of turning ideas into reality 
                  through clean, efficient code.
                </p>
              </div>

              <div className="about-card">
                <div className="card-header">
                  <GraduationCap className="card-icon" />
                  <h3>Computer Science Student</h3>
                </div>
                <p>
                  Currently finishing my senior year at Utah Valley University, 
                  where I've developed a strong foundation in software engineering, 
                  data structures, and system design.
                </p>
              </div>

              <div className="about-card">
                <div className="card-header">
                  <Heart className="card-icon" />
                  <h3>Problem Solver</h3>
                </div>
                <p>
                  I thrive on challenges and love finding creative solutions to complex problems. 
                  Whether it's optimizing performance or designing user-friendly interfaces, 
                  I approach each project with curiosity and determination.
                </p>
              </div>
            </motion.div>

            <motion.div className="skills-section" variants={itemVariants}>
              <h3>Technical Skills</h3>
              <div className="tech-scroll-container">
                <div className="tech-scroll-track">
                  {duplicatedTechStack.map((tech, index) => (
                    <div key={`${tech.name}-${index}`} className="tech-logo-item">
                      <img 
                        src={tech.logo} 
                        alt={tech.name}
                        className="tech-logo"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="tech-name">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;