// CustomerDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './CustomerDetails.scss';
import ProjectCard from "../../Dashboard/ProjectCard";

interface Customer {
    KundenID: number,
    Kundenname: string,
    AdresseID: number,
    Zahlungsinformationen: string,
    Unternehmen: string,
    Wert: number,
    Status: 'Qualified Lead' | 'Contact Made' | 'Offer Made' | 'In Development' | 'Negotiation Started',
    Straße?: string,
    Hausnummer?: string,
    Stadt?: string,
    Region?: string,
    Postleitzahl?: string,
    Land?: string,
    MitarbeiterID?: number,
}

interface Address {
    AdresseID: number,
    Straße: string,
    Hausnummer: string,
    Stadt: string,
    Region: string,
    Postleitzahl: string,
    Land: string,
}

interface Project {
    ProjektID: number,
    Matchcode: string,
    Status: string,
    Projektnummer: number,
    VerantwortlicherMitarbeiterID: number,
    RechnungsempfängerKundeID: number,
    Aktiv: boolean,
    Kundenname?: string,
    Mitarbeitername?: string,
}

const CustomerDetails = ({ customerID }: { customerID: number | null }) => {
    const [customer, setCustomer] = useState<Customer[]>();
    const [rotation1, setRotation1] = useState(0);
    const [closed1, setClosed1] = useState(false);
    const [rotation2, setRotation2] = useState(0);
    const [closed2, setClosed2] = useState(false);
    const [openProjects, setOpenProjects] = useState<Project[]>([]);
    const [employee, setEmployee] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<any>(null);

    const handleClick1 = () => {
        if (rotation1 == 0) {
            setRotation1(-90);
            setClosed1(true);
        } else {
            setRotation1(0);
            setClosed1(false);
        }
    }

    const handleClick2 = () => {
        if (rotation2 == 0) {
            setRotation2(-90);
            setClosed2(true);
        } else {
            setRotation2(0);
            setClosed2(false);
        }
    }

    const fetchEmployeeData = async (mitarbeiterID: number) => {
        try {
            const response = await fetch('http://192.168.178.58:3000/employeeData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    MitarbeiterID: mitarbeiterID
                }),
            });
            const data = await response.json();
            console.log(data)
            setEmployeeData(data); // Assuming the response is an object containing both 'E-Mail' and 'Telefonnummer'
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const [customerResponse, projectsResponse] = await Promise.all([
                    fetch('http://localhost:3000/customerDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ KundenID: customerID }),
                    }),
                    fetch('http://192.168.178.58:3000/projects'),
                ]);

                if (!customerResponse.ok) {
                    throw new Error('Network response for customer details was not ok');
                }

                if (!projectsResponse.ok) {
                    throw new Error('Network response for projects was not ok');
                }

                const [customerData, projectsData] = await Promise.all([
                    customerResponse.json(),
                    projectsResponse.json(),
                ]);

                setCustomer(customerData);

                // Find the first open project
                const firstOpenProject = projectsData.find((project: Project) => {
                    return project.RechnungsempfängerKundeID === customerID;
                });

                if (firstOpenProject) {
                    setEmployee(firstOpenProject.VerantwortlicherMitarbeiterID);
                    fetchEmployeeData(firstOpenProject.VerantwortlicherMitarbeiterID); // Fetch employee data
                }
            } catch (error) {
                console.error('There was an error fetching customer details or projects!', error);
            }
        };


        const fetchOpenProjects = async () => {
            try {
                const response = await fetch('http://192.168.178.58:3000/projects');
                const data = await response.json();

                const filteredProjects = data.filter((project: Project) => {
                    const isCustomer = project.RechnungsempfängerKundeID === customerID;
                    return isCustomer;
                });
                const projectsWithCustomerNames = await Promise.all(filteredProjects.map(async (project: Project) => {
                    const customerName = await fetchCustomerName(project.RechnungsempfängerKundeID);
                    const employeeName = await fetchEmployeeName(project.VerantwortlicherMitarbeiterID);
                    return { ...project, Kundenname: customerName, Mitarbeitername: employeeName };
                }));
                setOpenProjects(projectsWithCustomerNames);
            } catch (error) {
                console.error('Error fetching open projects: ', error);
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

        const fetchEmployeeName = async (verantwortlicherMitarbeiterID: number) => {
            try {
                const response = await fetch('http://192.168.178.58:3000/employeeName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        verantwortlicherMitarbeiterID: verantwortlicherMitarbeiterID
                    }),
                });
                const data = await response.json();
                return data[0].Name;
            } catch (error) {
                console.error('Fehler beim Abrufen des Mitarbeiternamen:', error);
                return '';
            }
        };

        fetchOpenProjects();
        fetchCustomerDetails();
    }, []);

    if (!customer) {
        return <div>Loading...</div>;
    }

    const { KundenID, Kundenname, Unternehmen, Wert, Status, Straße, Hausnummer, Stadt, Region, Postleitzahl, Land } = customer[0];
    console.log(employeeData)

    return (
        <div className="customer-details-container">
            <section className="customer-information">
                <div className="options-inner">
                    <div className="option">
                        <button onClick={handleClick1} style={{ transform: `rotate(${rotation1}deg)` }}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <h4>Kunde</h4>
                    </div>
                    <div className="personal-information" style={closed1 ? { display: "none" } : { display: "block" }}>
                        <ul>
                            <li>
                                <div className="column1">
                                    <p>KundenID</p>
                                </div>
                                <div className="column2">
                                    <span className="customer-id">{KundenID}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Vorname</p>
                                </div>
                                <div className="column2">
                                    <span className="firstname">{Kundenname.split(' ')[0]}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Nachname</p>
                                </div>
                                <div className="column2">
                                    <span className="lastname">{Kundenname.split(' ')[1]}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Unternehmen</p>
                                </div>
                                <div className="column2">
                                    <span className="company">{Unternehmen}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Wert</p>
                                </div>
                                <div className="column2">
                                    <span className="value">{Wert}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Status</p>
                                </div>
                                <div className="column2">
                                    <span className="status">{Status}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="option">
                        <button onClick={handleClick2} style={{ transform: `rotate(${rotation2}deg)` }}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <h4>Kontaktdaten</h4>
                    </div>
                    <div className="contact-information" style={closed2 ? { display: "none" } : { display: "block" }}>
                        <ul>
                            <li>
                                <div className="column1">
                                    <p>Straße</p>
                                </div>
                                <div className="column2">
                                    <span className="street">{Straße}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Hausnummer</p>
                                </div>
                                <div className="column2">
                                    <span className="house-number">{Hausnummer}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Stadt</p>
                                </div>
                                <div className="column2">
                                    <span className="city">{Stadt}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Region</p>
                                </div>
                                <div className="column2">
                                    <span className="region">{Region}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Postleitzahl</p>
                                </div>
                                <div className="column2">
                                    <span className="plz">{Postleitzahl}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Land</p>
                                </div>
                                <div className="column2">
                                    <span className="country">{Land}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Telefonnummer</p>
                                </div>
                                <div className="column2">
                                    <span className="phone-number">+49 123 4567890</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>E-Mail</p>
                                </div>
                                <div className="column2">
                                    <span className="email">maxmustermann@gmail.com</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="customer-projects">
                <h3>Projekte</h3>
                <div className="cards-container">
                    {openProjects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            matchcode={project.Matchcode}
                            customerName={project.Kundenname}
                            projectNumber={project.Projektnummer}
                        />
                    ))}
                </div>
            </section>
            <section className="partnership">
                <div className="options-inner">
                    <div className="option">
                        <button onClick={handleClick1} style={{ transform: `rotate(${rotation1}deg)` }}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <h4>Verantwortlicher Mitarbeiter</h4>
                    </div>
                    <div className="personal-information" style={closed1 ? { display: "none" } : { display: "block" }}>
                        <ul>
                            <li>
                                <div className="column1">
                                    <p>MitarbeiterID</p>
                                </div>
                                <div className="column2">
                                    <span className="employee-id">{employeeData && employeeData[0]?.MitarbeiterID}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Vorname</p>
                                </div>
                                <div className="column2">
                                    <span className="firstname">{employeeData && employeeData[0].Name.split(' ')[0]}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Nachname</p>
                                </div>
                                <div className="column2">
                                    <span className="lastname">{employeeData && employeeData[0].Name.split(' ')[1]}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Telefonnummer</p>
                                </div>
                                <div className="column2">
                                    <span className="">{employeeData && employeeData[0].Telefonnummer}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>E-Mail</p>
                                </div>
                                <div className="column2">
                                    <span className="">{employeeData && employeeData[0]['E-Mail']}</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p></p>
                                </div>
                                <div className="column2">
                                    <span className=""></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CustomerDetails;
