import React, { useState, useEffect } from 'react';
import './style.css';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:1234/api/projects`)
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading projects...</p>;

    if (selectedProject) {
        return (
            <div id="projectDetails">
                <h1>{selectedProject.Name}</h1>
                <p>{selectedProject.Description}</p>
                <a href={selectedProject.repoLink} target="_blank" rel="noopener noreferrer">View Repository</a>
                <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                <button onClick={() => setSelectedProject(null)}>Back to Projects</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Select a Project to Explore</h1>
            <div id="projectChoices">
                {projects.map((project, index) => (
                    <button key={index} onClick={() => setSelectedProject(project)}>
                        <img src={project.ImageURL} alt={project.Name} />
                        <h2>{project.Name}</h2>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Projects;