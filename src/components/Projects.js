import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  const projects = [
    {
      title: "Personal Portfolio",
      description: "A modern, responsive portfolio website built with React and Framer Motion. Features smooth animations, dark/light theme toggle, interactive navigation, animated tech skills showcase, and downloadable PDF resume functionality.",
      tech: ["React", "Framer Motion", "CSS3", "JavaScript"],
      github: "#",
      live: "https://www.tylerjayp.com/",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    },
    {
  title: "Personal Mood Journal",
  description: "A comprehensive mood tracking application featuring daily journal entries, mood analytics, photo integration, and speech-to-text functionality. Includes visual mood tracking, gratitude journaling, personalized insights, and a calendar view for emotional pattern analysis.",
  tech: ["React", "React Router", "CSS3", "Local Storage", "Speech-to-Text API", "Canvas API"],
  github: "https://github.com/TylerJayP/MoodJournal",
  live: "https://personalmoodjournal.netlify.app",
  image: "./images/MoodJournalPic.png"
    },
{
  title: "Virtual Dyno Pro",
  description: "A professional automotive dyno analysis tool that processes AccessPort and OBD2 datalog files to generate accurate horsepower and torque curves. Features advanced algorithms for AFR correction, knock retard penalties, atmospheric compensation, and gear-specific calculations calibrated against real dyno results.",
  tech: ["C# ASP.NET Core", "Entity Framework", "React", "Chart.js", "CSV Processing", "REST APIs"],
  github: "https://github.com/TylerJayP/VirtualDyno",
  live: "https://github.com/TylerJayP/VirtualDyno/blob/master/ReadMe.md", 
  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop" 
}
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              variants={projectVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-links">
                    <motion.a
                      href={project.github}
                      className="project-link"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github size={20} />
                    </motion.a>
                    <motion.a
                      href={project.live}
                      className="project-link"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
