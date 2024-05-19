import React, { useState } from "react";
import { Status, statuses } from "../../utils/data-card.ts";
import UseDeals from "./UseDeals.tsx";
import BoardView from "./Views/BoardView.tsx";
import ListView from "./Views/ListView.tsx";
import TableView from "./Views/TableView.tsx";
import './Deals.scss';

const Deals = () => {
    const { cards, setCards, updateCard } = UseDeals();
    const [newCard, setNewCard] = useState({ Kundenname: '', Unternehmen: '', Wert: 0, Status: statuses[0] });
    const [view, setView] = useState('board');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <div className="left">
                    <div className="change-view">
                        <button className={view === "board" ? "active board-view" : "board-view"} onClick={() => changeView('board')}>
                            <span className="material-symbols-outlined">
                                view_column
                            </span>
                        </button>
                        <button className={view === "list" ? "active list-view" : "list-view"} onClick={() => changeView('list')}>
                            <span className="material-symbols-outlined">
                                list
                            </span>
                        </button>
                        <button className={view === "table" ? "active table-view" : "table-view"} onClick={() => changeView('table')}>
                            <span className="material-symbols-outlined">
                                view_module
                            </span>
                        </button>
                    </div>

                    <button className="add-card" onClick={() => setIsModalOpen(true)}>
                        + Deal
                    </button>
                </div>
                <div className="right">
                    <div className="numbers">
                        <span>{cards.reduce((accumulator, currentCard) => accumulator + currentCard.Wert, 0).toLocaleString()} €</span>
                        <span>~</span>
                        <span>{cards.length} Deals</span>
                    </div>
                </div>
            </div>
            {view === "board" ? <BoardView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
            {view === "list" ? <ListView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
            {view === "table" ? <TableView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
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