import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import GaugeChart from 'react-gauge-chart';
import './Dashboard.scss';
import ProjectCard from "./ProjectCard";

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

const Dashboard = ({ userID }: { userID: number | null }) => {
    const [leadsByStatus, setLeadsByStatus] = useState([]);
    const [leadData, setLeadData] = useState<any>([]);
    const [incomeData, setIncomeData] = useState<any>([]);
    const [targetLeads, setTargetLeads] = useState<number>(0);
    const [actualLeads, setActualLeads] = useState<number>(0);
    const [openProjects, setOpenProjects] = useState<Project[]>([]);
    console.log(userID);

    useEffect(() => {
        const fetchLeadsByStatus = async () => {
            try {
                const response = await fetch('http://localhost:3000/leadsByStatus');
                const data = await response.json();
                setLeadsByStatus(data);
            } catch (error) {
                console.error('Error fetching leads by status: ', error);
            }
        };

        const fetchLeadData = async () => {
            try {
                // Fetch data from the server
                const response = await fetch('http://localhost:3000/leadDevelopmentData');
                const data = await response.json();
                setLeadData(data);

                if (data.length > 0) {
                    setTargetLeads(data.reduce((sum: number, entry: any) => sum + entry.TargetLeads, 0));
                    setActualLeads(data.reduce((sum: number, entry: any) => sum + entry.ActualLeads, 0));
                }
            } catch (error) {
                console.error('Error fetching lead development data: ', error);
            }
        };

        const fetchIncomeData = async () => {
            try {
                // Fetch data from the server
                const response = await fetch('http://localhost:3000/incomeDevelopmentData');
                let data = await response.json();
                setIncomeData(data)
            } catch (error) {
                console.error('Error fetching income development data: ', error);
            }
        };

        const fetchOpenProjects = async () => {
            try {
                const response = await fetch('http://localhost:3000/projects');
                const data = await response.json();

                const filteredProjects = data.filter((project: Project) => {
                    const isActive = project.Aktiv === true;
                    const isUserMatch = project.VerantwortlicherMitarbeiterID === userID;
                    return isActive && isUserMatch;
                });


                const projectsWithCustomerNames = await Promise.all(filteredProjects.map(async (project: Project) => {
                    const customerName = await fetchCustomerName(project.RechnungsempfängerKundeID);
                    return { ...project, Kundenname: customerName };
                }));
                setOpenProjects(projectsWithCustomerNames);
            } catch (error) {
                console.error('Error fetching open projects: ', error);
            }
        };
        console.log(openProjects);

        const fetchCustomerName = async (rechnungsempfängerKundeID: number) => {
            try {
                const response = await fetch('http://localhost:3000/customerName', {
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

        fetchLeadsByStatus();
        fetchLeadData();
        fetchIncomeData();
        fetchOpenProjects();
    }, []);

    if (leadData.length === 0) {
        return null; // Render nothing if leadData is empty
    }

    const maxLeads = Math.max(
        ...leadData.map((entry: any) => Math.max(entry.TargetLeads, entry.ActualLeads))
    );

    const minLeads = Math.min(
        ...leadData.map((entry: any) => Math.min(entry.TargetLeads, entry.ActualLeads))
    );

    const bufferLeadValue = 10;
    const upperLeadBound = Math.ceil((maxLeads + bufferLeadValue) / 10) * 10;
    const lowerLeadBound = Math.floor((minLeads - bufferLeadValue) / 10) * 10;
    const numLeadTicks = Math.ceil((upperLeadBound - lowerLeadBound) / 10) + 1;

    const maxIncome = Math.max(
        ...incomeData.map((entry: any) => Math.max(entry.Income))
    );

    const minIncome = Math.min(
        ...incomeData.map((entry: any) => Math.min(entry.Income))
    );

    const bufferIncomeValue = 100;
    const upperIncomeBound = Math.ceil((maxIncome + bufferIncomeValue) / 1000) * 1000;
    const lowerIncomeBound = Math.floor((minIncome - bufferIncomeValue) / 1000) * 1000;
    const numIncomeTicks = Math.ceil((upperIncomeBound - lowerIncomeBound) / 1000) + 1;

    //const COLORS = ['#2A4066', '#1D5B7E', '#0E7496', '#009EAF', '#00C49F'];
    const COLORS = ['#009FFF', '#00C5FF', '#00DFFF', '#00FFDF', '#7DFFFC'];

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        const monthNames = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
        return monthNames[date.getMonth()];
    };

    const percentage = (actualLeads / targetLeads) * 100;

    const CustomLeadTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: Date }) => {
        if (active && payload && payload.length) {
            const date = new Date(label || '');
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const formattedLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

            return (
                <div className="custom-tooltip">
                    <p className="label">{formattedLabel}</p>
                    <p className="target-leads">{`Target Leads: ${payload[0].payload.TargetLeads}`}</p>
                    <p className="actual-leads">{`Actual Leads: ${payload[0].payload.ActualLeads}`}</p>
                </div>
            );
        }

        return null;
    };

    const CustomIncomeTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: Date }) => {
        if (active && payload && payload.length) {
            const date = new Date(label || '');
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const formattedLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

            return (
                <div className="custom-tooltip">
                    <p className="label">{formattedLabel}</p>
                    <p className="income">{`Income: ${payload[0].payload.Income}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="dashboard">
            <section className="valueDeals">
                <h3>Current Deals</h3>
                <div className="gauge-chart">
                    <ResponsiveContainer width="100%" height={150}>
                        <GaugeChart
                            id="value-deals-gauge"
                            nrOfLevels={3}
                            arcsLength={[0.3, 0.4, 0.3]}
                            colors={['#FF5F6D', '#FFC371', '#00C49F']}
                            percent={percentage / 100}
                            formatTextValue={() => `${actualLeads} Deals`}
                            style={{ width: '100%', height: 150 }}
                        />
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-10px', fontWeight: '400' }}>
                    <span>0 Deals</span>
                    <span>{targetLeads} Deals</span>
                </div>
            </section>
            <section className="contacts">
                <h3>Contacts</h3>
            </section>
            <section className="contacts">
                <h3>Contacts</h3>
            </section>
            <section className="incomeDevelopment">
                <h3>Income Development</h3>
                <div className="line-chart-container">
                    <ResponsiveContainer width="100%" height={165}>
                        <LineChart data={incomeData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="MonthYear" tickFormatter={formatXAxis} />
                            <YAxis domain={[lowerIncomeBound, upperIncomeBound]} />
                            <Tooltip content={<CustomIncomeTooltip />} />
                            <Line type="monotone" dataKey="Income" stroke="#00C5FF" strokeWidth={2} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 2.5, fill: '#00C5FF' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section className="leadDevelopment">
                <h3>Lead Development</h3>
                <div className="line-chart-container">
                    <ResponsiveContainer width="100%" height={165}>
                        <LineChart data={leadData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="MonthYear" tickFormatter={formatXAxis} />
                            <YAxis domain={[lowerLeadBound, upperLeadBound]} ticks={[...Array(numLeadTicks).keys()].map(i => lowerLeadBound + i * 10)} />
                            <Tooltip content={<CustomLeadTooltip />} />
                            <Line type="monotone" dataKey="TargetLeads" stroke="#00C5FF" strokeWidth={2} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 2.5, fill: '#00C5FF' }} />
                            <Line type="monotone" dataKey="ActualLeads" stroke="#00FFDF" strokeWidth={2} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 2.5, fill: '#00FFDF' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section className="leadsByStatus">
                <h3>Leads By Status</h3>
                <div className="pie-chart-container">
                    <ResponsiveContainer width="100%" height={165}>
                        <PieChart>
                            <Pie
                                data={leadsByStatus}
                                cx="45%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={75}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="Status"
                            >
                                {leadsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" align="right" verticalAlign="middle" style={{ fontSize: "20px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section className="documents">
                <h3>Documents</h3>
            </section>
            <section className="openProjects">
                <h3>Open Projects</h3>
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
        </div >
    );
}

export default Dashboard