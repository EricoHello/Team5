import React, { useState, useEffect } from 'react';
import './style.css';

/**
 * 
 * This component displays a list of projects that users can explore. Users can click on a project 
 * to view more details about it. The component fetches the project data from the server and displays
 * it to the user.
 */
const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * This useEffect hook fetches the project data from the server when the component is mounted.
     * It updates the projects state with the received data. If there is an error, the error state is updated.
     * The loading state is set to false once the data is received.
     */
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

    // Display loading message while fetching data
    if (loading) return <p>Loading projects...</p>;

    if (selectedProject) {
        /**
         * Display project details when a project is selected. This section displays the project name, 
         * image, and description. It also includes a flashcard component that displays steps for the project
         */
        return (
            <div id="projectDetails">
                <h1>{selectedProject.Name}</h1>

                {/* Flashcard */}
                <h2>Step 1: Setting Up VS Code</h2>
                <div id="flashcard">
                    <h3>Step 1: Setting Up VS Code</h3>
                    <p>
                        <strong>Download and install VS Code</strong> from the official website:
                        <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">
                            https://code.visualstudio.com/
                        </a>
                    </p>
                    <p>
                        Once installed, open VS Code and create a new file by navigating to:
                        <strong>File → New File</strong>.
                    </p>
                </div>
                <button onClick>Back</button>
                <button onClick>Next</button>

                <br />
                <a href={selectedProject.repoLink} target="_blank" rel="noopener noreferrer">View Repository</a>
                <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
            </div>
        );
    }

    /**
     * Display a list of projects for the user to choose from. Each project is displayed as a button
     * with the project name and image. When a user clicks on a project, the setSelectedProject function is called
     * to display the project details.
     */
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