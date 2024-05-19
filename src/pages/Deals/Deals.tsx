import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card.tsx";
import { Customer, Status, statuses } from "../../utils/data-card.ts";
import './Deals.scss';

const Deals = () => {
    const [view, setView] = useState('board');
    const [cards, setCards] = useState<Customer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCard, setNewCard] = useState({ Kundenname: '', Unternehmen: '', Wert: 0, Status: statuses[0] });

    const columns = statuses.map((status) => {
        const cardsInColumn = cards.filter((card) => card.Status === status);
        return {
            status,
            cards: cardsInColumn,
        }
    })

    useEffect(() => {
        const fetchConnectionData = async () => {
            try {
                const response = await fetch('http://localhost:3000/deals');
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
            const response = await fetch(`http://localhost:3000/deals/${card.KundenID}`, {
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

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault();
        const cardID = e.dataTransfer.getData("KundenID");
        const card = cards.find((card) => card.KundenID == cardID)
        if (card) {
            await updateCard({ ...card, Status: status })
        }
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, KundenID: string) => {
        e.dataTransfer.setData("KundenID", KundenID.toString());
    }

    const changeView = (selectedView: string) => {
        setView(selectedView);
    };

    const showBoardView = () => {
        return (
            <div className="board">
                {columns.map(column => (
                    <div key={column.status} onDrop={(e) => handleDrop(e, column.status)} onDragOver={(e) => e.preventDefault()} className="column">
                        <h2>{column.status}</h2>
                        <div className="">
                            {column.cards.map(card => (
                                <div key={card.KundenID} draggable onDragStart={(e) => handleDragStart(e, card.KundenID)}>
                                    <Card card={card} updateCard={updateCard} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const showListView = () => {
        return (
            <div className="list">
                {columns.map(column => (
                    <div key={column.status} onDrop={(e) => handleDrop(e, column.status)} onDragOver={(e) => e.preventDefault()} className="list-column">
                        <h2>{column.status}</h2>
                        <div className="list-cards">
                            {column.cards.map(card => (
                                <div key={card.KundenID} draggable onDragStart={(e) => handleDragStart(e, card.KundenID)}>
                                    <Card card={card} updateCard={updateCard} />
                                </div>
                            ))}
                        </div>
                        <div className="line"></div>
                    </div>
                ))}
            </div>
        );
    }

    const showTableView = () => {
        return (
            <div className="table">

            </div>
        );
    }

    const addCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/deals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCard)
            });

            if (!response.ok) {
                throw new Error('Failed to add card');
            }

            const data = await response.json();
            // Assuming your backend returns the newly added card with an ID
            const newCardWithId = { ...newCard, KundenID: data.KundenID };

            setCards([...cards, newCardWithId]);
            setIsModalOpen(false);
            setNewCard({ Kundenname: '', Unternehmen: '', Wert: 0, Status: statuses[0] });
        } catch (error) {
            console.error('Error adding card:', error);
            // Handle error (e.g., show error message to the user)
        }
    };

    return (
        <div className="deals">
            <div className="options">
                <div className="change-view">
                    <button className={view === "board" ? "active" : ""} onClick={() => changeView("board")}>
                        <span className="material-symbols-outlined">
                            view_column
                        </span>
                    </button>
                    <button className={view === "list" ? "active" : ""} onClick={() => changeView("list")}>
                        <span className="material-symbols-outlined">
                            list
                        </span>
                    </button>
                    <button className={view === "table" ? "active" : ""} onClick={() => changeView("table")}>
                        <span className="material-symbols-outlined">
                            view_module
                        </span>
                    </button>
                </div>

                <button className="add-card" onClick={() => setIsModalOpen(true)}>
                    + Deal
                </button>
            </div>
            {view === "board" ? showBoardView() : ""}
            {view === "list" ? showListView() : ""}
            {view === "table" ? showTableView() : ""}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Add a Deal</h2>
                        <form onSubmit={addCard}>
                            <label>
                                <p>Person:</p>
                                <input type="text" value={newCard.Kundenname} onChange={(e) => setNewCard({ ...newCard, Kundenname: e.target.value })} required />
                            </label>
                            <label>
                                <p>Company:</p>
                                <input type="text" value={newCard.Unternehmen} onChange={(e) => setNewCard({ ...newCard, Unternehmen: e.target.value })} required />
                            </label>
                            <label>
                                <p>Money:</p>
                                <input type="number" value={newCard.Wert} onChange={(e) => setNewCard({ ...newCard, Wert: parseInt(e.target.value) })} required />
                            </label>
                            <label>
                                <p>Status:</p>
                                <select value={newCard.Status} onChange={(e) => setNewCard({ ...newCard, Status: e.target.value as Status })}>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="line"></div>
                            <button type="submit">Add Card</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Deals;