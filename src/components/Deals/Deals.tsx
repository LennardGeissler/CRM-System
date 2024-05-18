import React, { useEffect, useState } from "react";
import Card from "../Card/Card.tsx";
import { Customer, Status, statuses } from "../../data-card.ts";
import './Deals.scss';

const Deals = () => {
    const [view, setView] = useState('board');
    const [cards, setCards] = useState<Customer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCard, setNewCard] = useState({ person: '', company: '', money: 0, status: statuses[0] });

    const columns = statuses.map((status) => {
        const cardsInColumn = cards.filter((card) => card.status === status);
        return {
            status,
            cards: cardsInColumn,
        }
    })

    useEffect(() => {
        fetch('http://localhost:3000/cards').then((res) => res.json()).then((data) => {
            setCards(data);
        })
    }, []);

    const updateCard = (card: Customer) => {
        fetch(`http://localhost:3000/cards/${card.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(card)
        })
        const updatedTasks = cards.map((t) => {
            return t.id === card.id ? card : t
        })
        setCards(updatedTasks)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault()
        setCurrentlyHoveringOver(null)
        const id = e.dataTransfer.getData("id")
        const card = cards.find((card) => card.id === id)
        if (card) {
            updateCard({ ...card, status })
        }
    }

    const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
    const handleDragEnter = (status: Status) => {
        setCurrentlyHoveringOver(status)
    }

    const changeView = (selectedView: any) => {
        setView(selectedView);
    };

    const showBoardView = () => {
        return (
            <div className="board">
                {columns.map(column => (
                    <div onDrop={(e) => handleDrop(e, column.status)} onDragOver={(e) => e.preventDefault()} onDragEnter={() => handleDragEnter(column.status)} className="column">
                        <h2>{column.status}</h2>
                        <div className="">
                            {column.cards.map(card => (
                                <Card key={card.id} card={card} updateCard={updateCard} />
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

            </div>
        );
    }

    const showTableView = () => {
        return (
            <div className="table">

            </div>
        );
    }

    const addCard = (e: React.FormEvent) => {
        e.preventDefault();
        const newCardWithId = {
            ...newCard,
            id: (cards.length + 1).toString(),
        };
        fetch('http://localhost:3000/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCardWithId)
        }).then(() => {
            setCards([...cards, newCardWithId]);
            setIsModalOpen(false);
            setNewCard({ person: '', company: '', money: 0, status: statuses[0] });
        });
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
                                <input type="text" value={newCard.person} onChange={(e) => setNewCard({ ...newCard, person: e.target.value })} required />
                            </label>
                            <label>
                                <p>Company:</p>
                                <input type="text" value={newCard.company} onChange={(e) => setNewCard({ ...newCard, company: e.target.value })} required />
                            </label>
                            <label>
                                <p>Money:</p>
                                <input type="number" value={newCard.money} onChange={(e) => setNewCard({ ...newCard, money: parseInt(e.target.value) })} required />
                            </label>
                            <label>
                                <p>Status:</p>
                                <select value={newCard.status} onChange={(e) => setNewCard({ ...newCard, status: e.target.value as Status })}>
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