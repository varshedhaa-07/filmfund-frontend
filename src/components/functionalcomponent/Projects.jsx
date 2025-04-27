import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // Fetch projects from backend on page load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://filmfund.onrender.com/api/films"); // ✅ Backend call
        setProjects(res.data); // Save fetched projects
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-container">
      {/* Home button */}
      <button className="back-button" onClick={() => navigate("/")}>←</button>

      {/* Centered heading */}
      <h1 className="projects-title">Explore Short Film Projects</h1>

      {/* Grid layout for projects */}
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <img src={project.image} alt={project.title} className="project-image" />
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <button className="fund-button" onClick={() => navigate(`/fund/${project._id}`)}>Fund Now</button>
            </div>
          ))
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
