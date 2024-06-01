import React, { useState, useEffect } from "react";
import './Contacts.scss';
import CustomerDetails from "./CustomerDetails/CustomerDetails";

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

const Contacts = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [view, setView] = useState<string>('table');
    const [customerID, setCustomerID] = useState<number | null>(null)

    useEffect(() => {
        const fetchConnectionData = async () => {
            try {
                const customersResponse = await fetch('http://localhost:3000/deals');
                const customersData = await customersResponse.json();

                const addressesResponse = await fetch('http://localhost:3000/address');
                const addressesData = await addressesResponse.json();

                const combinedData = customersData.recordset.map((customer: Customer) => {
                    const address = addressesData.recordset.find((addr: Address) => addr.AdresseID === customer.AdresseID);
                    return {
                        ...customer,
                        ...address
                    };
                });

                setCustomers(combinedData);
            } catch (error) {
                console.error('There was an error fetching the connection data!', error);
            }
        };

        fetchConnectionData();
    }, [])

    return (
        <div className="contacts-container">
            {view == 'table' && (
                <>
                    <div className="title">
                        <h2>Kontaktliste</h2>
                        <div className="line"></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>KundenID</th>
                                <th>Kundenname
                                    {/* <label>
                                <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
                                    <option value="">Alle</option>
                                    <option value="Lennard Geißler">Lennard Geißler</option>
                                    <option value="Cedric Bergmann">Cedric Bergmann</option>
                                </select>
                            </label> */}
                                </th>
                                <th>Unternehmen</th>
                                <th>Straße</th>
                                <th>Hausnummer</th>
                                <th>Stadt</th>
                                <th>Region</th>
                                <th>Postleitzahl</th>
                                <th>Land</th>
                                <th>Wert
                                    {/* <button onClick={() => handleSort('Deadline')}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button> */}
                                </th>
                                <th>Status
                                    {/* <label>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="">Alle</option>
                                    <option value="Ausstehend">Ausstehend</option>
                                    <option value="Nicht begonnen">Nicht begonnen</option>
                                    <option value="In Bearbeitung">In Bearbeitung</option>
                                </select>
                            </label> */}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.KundenID}>
                                    <td>{customer.KundenID}</td>
                                    <td className="customer-name" onClick={() => {
                                        setView('customer');
                                        setCustomerID(customer.KundenID);
                                    }}>{customer.Kundenname}</td>
                                    <td>{customer.Unternehmen}</td>
                                    <td>{customer.Straße}</td>
                                    <td>{customer.Hausnummer}</td>
                                    <td>{customer.Stadt}</td>
                                    <td>{customer.Region}</td>
                                    <td>{customer.Postleitzahl}</td>
                                    <td>{customer.Land}</td>
                                    <td>{customer.Wert.toLocaleString()}</td>
                                    <td>{customer.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {view == 'customer' && (
                <CustomerDetails customerID={customerID}></CustomerDetails>
            )}
        </div>
    );
}

export default Contacts;