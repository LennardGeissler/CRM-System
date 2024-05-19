import React, { useState, useEffect } from "react";
import './Dashboard.scss';

const Dashboard = () => {
    // const [employee, setEmployee] = useState([]);

    // useEffect(() => {
    //     const fetchConnectionData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000');
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             console.log(data);
    //             setEmployee(data.recordset);
    //         } catch (error) {
    //             console.error('There was an error fetching the connection data!', error);
    //         }
    //     };

    //     fetchConnectionData();
    // }, []);

    return (
        <div className="dashboard">
            <main>
                <div className="top">
                    <section className="valueDeals">
                        <h3>Current Deals</h3>
                    </section>
                    <section className="contacts">
                        <h3>Contacts</h3>
                    </section>
                    <section className="topCustomers">
                        <h3>Top Customers</h3>
                    </section>
                </div>
                <div className="center">
                    <section className="incomeDevelopment">
                        <h3>Income Development</h3>
                    </section>
                    <section className="leadsByStatus">
                        <h3>Leads By Status</h3>
                    </section>
                </div>
                <div className="bottom">
                    <section className="documents">
                        <h3>Documents</h3>
                    </section>
                </div>
            </main>
            <div className="right">
                <section className="openProjects">
                    <h3>Open Projects</h3>
                    <ul>
                        {/* {employee.map((employee:any) => (
                            <li key={employee.MitarbeiterID}>
                                <h2>{employee.Name}</h2>
                                <p>Admin Rolle: {employee.AdminRolle ? 'Ja' : 'Nein'}</p>
                            </li>
                        ))} */}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default Dashboard