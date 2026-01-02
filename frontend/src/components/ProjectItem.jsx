import React from "react";
import { NavLink } from "react-router-dom";

export default function ProjectItem(props) {
    const project = props.project;
  return (
    <div className="project_item">
      <div class="project_info">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <NavLink to={`/projects/${project.handle}`}>View Project Details</NavLink>
      </div>
      <img src={project.thumbnail}></img>
    </div>
  );
}