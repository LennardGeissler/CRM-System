import { useState, useEffect } from "react";
import './Projects.scss';

interface Project {
    ProjektID: number,
    Matchcode: string,
    Status: string,
    Projektnummer: number,
    VerantwortlicherMitarbeiterID: number,
    RechnungsempfängerKundeID: number,
    Aktiv: number,
    Kundenname?: string,
    Mitarbeitername?:string,
}

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://192.168.178.58:3000/projects');
                const data = await response.json();

                const projectsWithCustomerNames = await Promise.all(data.map(async (project: Project) => {
                    const customerName = await fetchCustomerName(project.RechnungsempfängerKundeID);
                    const employeeName = await fetchEmployeeName(project.VerantwortlicherMitarbeiterID);
                    return { ...project, Kundenname: customerName, Mitarbeitername: employeeName };
                }));
                setProjects(projectsWithCustomerNames);
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Aufgaben!', error);
            }
        };

        const fetchCustomerName = async (rechnungsempfängerKundeID: number) => {
            try {
                const response = await fetch('http://192.168.178.58:3000/customerName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rechnungsempfangerKundeID: rechnungsempfängerKundeID
                    }),
                });
                const data = await response.json();
                return data[0].Kundenname;
            } catch (error) {
                console.error('Fehler beim Abrufen des Kundenname:', error);
                return '';
            }
        };

        const fetchEmployeeName = async (mitarbeiterID: number) => {
            try {
                const response = await fetch('http://192.168.178.58:3000/employeeName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        verantwortlicherMitarbeiterID: mitarbeiterID
                    }),
                });
                const data = await response.json();
                return data[0].Name;
            } catch (error) {
                console.error('Fehler beim Abrufen des Mitarbeiternamen:', error);
                return '';
            }
        };

        fetchProjects();
    }, []);
    
    console.log(projects);
    const handleCardClick = (ProjektID: number) => {
        setFlippedCards(prevState => ({
            ...prevState,
            [ProjektID]: !prevState[ProjektID]
        }));
    };

    const getStatusClass = (status: Project['Status']) => {
        switch (status) {
            case 'Klärung':
                return 'status-red';
            case 'Entwicklung':
                return 'status-blue';
            case 'Abgeschlossen':
                return 'status-green';
            default:
                return '';
        }
    };

    return (
        <div className="gallery">
            {projects.map(project => (
                <div
                    className={`card ${flippedCards[project.ProjektID] ? 'flipped' : ''}`}
                    key={project.ProjektID}
                    onClick={() => handleCardClick(project.ProjektID)}
                >
                    <div className="card-inner">
                        <div className="card-front">
                            <h3>{project.Matchcode}</h3>
                            <p><strong>Kundenname:</strong>{project.Kundenname}</p>
                            <button className={`status ${getStatusClass(project.Status)}`}>
                                {project.Status == 'Klärung' && (
                                    <span>Klärung</span>
                                )}
                                {project.Status == 'Entwicklung' && (
                                    <span>Entwicklung</span>
                                )}
                                {project.Status == 'Abgeschlossen' && (
                                    <span>Abgeschlossen</span>
                                )}
                            </button>
                        </div>
                        <div className="card-back">
                            <p><strong>Projektnummer:</strong>{project.Projektnummer}</p>
                            <p><strong>Person:</strong> {project.Mitarbeitername}</p>
                            <p><strong>Aktiv:</strong> {project.Aktiv == 1 ? "Ja" : "Nein"}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Projects;