import React from 'react';
import './ProjectCard.scss';

interface CardProps {
    matchcode: string;
    customerName?: string;
    projectNumber: number;
}

const ProjectCard: React.FC<CardProps> = ({ matchcode, customerName, projectNumber }) => {
    return (
        <div className="project-card">
            <h3 className="card-title">{matchcode}</h3>
            <p className="card-customer">Kundenname: {customerName}</p>
            <p className="card-project-number">Projektnummer: {projectNumber}</p>
        </div>
    );
}

export default ProjectCard;
