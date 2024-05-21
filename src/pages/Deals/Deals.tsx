import React, { useState } from "react";
import { Status, statuses } from "../../utils/data-card.ts";
import UseDeals from "./UseDeals.tsx";
import AddDeals from "./AddDeals.tsx";
import Options from "./Options.tsx";
import BoardView from "./Views/BoardView.tsx";
import ListView from "./Views/ListView.tsx";
import TableView from "./Views/TableView.tsx";
import './Deals.scss';

const initialNewCardState = {
    Kundenname: '',
    Unternehmen: '',
    Wert: 0,
    Status: statuses[0]
};

const Deals = () => {
    const { cards, setCards, updateCard } = UseDeals();
    const [newCard, setNewCard] = useState(initialNewCardState);
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
        e.dataTransfer.setData("KundenID", KundenID);
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
            const newCardWithId = { ...newCard, KundenID: data.KundenID };

            setCards([...cards, newCardWithId]);
            setIsModalOpen(false);
            setNewCard(initialNewCardState);
        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    return (
        <div className="deals">
            <Options view={view} changeView={changeView} setIsModalOpen={setIsModalOpen} cards={cards} />
            {view === "board" ? <BoardView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
            {view === "list" ? <ListView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
            {view === "table" ? <TableView cards={cards} handleDrop={handleDrop} handleDragStart={handleDragStart} updateCard={updateCard} /> : ""}
            {isModalOpen && <AddDeals newCard={newCard} setNewCard={setNewCard} addCard={addCard} setIsModalOpen={setIsModalOpen} />}
        </div>
    );
}

export default Deals;