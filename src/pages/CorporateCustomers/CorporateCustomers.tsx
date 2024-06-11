import React, { useState, useEffect } from "react";
import './CorporateCustomers.scss';
import CustomerDetails from "./CustomerDetails/CustomerDetails";

interface CorporateCustomer {
    KundenID: number,
    Unternehmen: string,
    AdresseID: number,
    Zahlungsinformationen: string,
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

const CorporateCustomers = () => {
    const [customers, setCustomers] = useState<CorporateCustomer[]>([]);
    const [view, setView] = useState<string>('table');
    const [customerID, setCustomerID] = useState<number | null>(null)

    useEffect(() => {
        const fetchConnectionData = async () => {
            try {
                const customersResponse = await fetch('http://localhost:3000/deals');
                const customersData = await customersResponse.json();

                const addressesResponse = await fetch('http://localhost:3000/address');
                const addressesData = await addressesResponse.json();

                const combinedData = customersData.recordset.map((customer: CorporateCustomer) => {
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
                        <h2>Firmenkunden</h2>
                        <div className="line"></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>KundenID</th>
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
                                    <td data-label="KundenID">{customer.KundenID}</td>
                                    <td data-label="Unternehmen">{customer.Unternehmen}</td>
                                    <td data-label="Straße">{customer.Straße}</td>
                                    <td data-label="Hausnummer">{customer.Hausnummer}</td>
                                    <td data-label="Stadt">{customer.Stadt}</td>
                                    <td data-label="Region">{customer.Region}</td>
                                    <td data-label="Postleitzahl">{customer.Postleitzahl}</td>
                                    <td data-label="Land">{customer.Land}</td>
                                    <td data-label="Wert">{customer.Wert.toLocaleString()}</td>
                                    <td data-label="Status">{customer.Status}</td>
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

export default CorporateCustomers;