// CustomerDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './CustomerDetails.scss';

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

const CustomerDetails = ({ customerID } : {customerID:number | null}) => {
    const [customer, setCustomer] = useState<Customer[]>();

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch('http://localhost:3000/customerDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ KundenID: customerID }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCustomer(data);
            } catch (error) {
                console.error('There was an error fetching the customer details!', error);
            }
        };

        fetchCustomerDetails();
    }, []);

    if (!customer) {
        return <div>Loading...</div>;
    }

    const { Kundenname, Unternehmen, Wert, Status, Straße, Hausnummer, Stadt, Region, Postleitzahl, Land } = customer[0];

    return (
        <div className="customer-details-container">
            <h2>Kundendetails</h2>
            <div>
                <h3>{Kundenname}</h3>
                <p><strong>Unternehmen:</strong> {Unternehmen}</p>
                <p><strong>Zahlungsinformationen:</strong> {Wert}</p>
                <p><strong>Status:</strong> {Status}</p>
            </div>
            <div>
                <h3>Adresse</h3>
                <p><strong>Straße:</strong> {Straße}</p>
                <p><strong>Hausnummer:</strong> {Hausnummer}</p>
                <p><strong>Stadt:</strong> {Stadt}</p>
                <p><strong>Region:</strong> {Region}</p>
                <p><strong>Postleitzahl:</strong> {Postleitzahl}</p>
                <p><strong>Land:</strong> {Land}</p>
            </div>
        </div>
    );
}

export default CustomerDetails;
