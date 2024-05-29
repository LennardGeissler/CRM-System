import React, { useState, useEffect} from "react";
import { Customer } from "../../utils/data-card";

const UseDeals = () => {
    const [cards, setCards] = useState<Customer[]>([]);

    useEffect(() => {
        const fetchConnectionData = async () => {
            try {
                const response = await fetch('http://192.168.178.58:3000/deals');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCards(data.recordset);
            } catch (error) {
                console.error('There was an error fetching the connection data!', error);
            }
        };

        fetchConnectionData();
    }, []);

    const updateCard = async (card: Customer) => {
        try {
            const response = await fetch(`http://192.168.178.58:3000/deals/${card.KundenID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(card)
            });

            if (!response.ok) {
                throw new Error('Failed to update card');
            }

            setCards((cards) => cards.map(c => (c.KundenID === card.KundenID ? card : c)));
        } catch (error) {
            console.error('Error updating card:', error)
        }
    }

    return { cards, setCards, updateCard };
}

export default UseDeals;