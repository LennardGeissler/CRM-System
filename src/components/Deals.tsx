import React, { useEffect, useState } from "react";
import Card from "./Card.tsx";
import { Customer, Status, statuses } from "../data-card.ts";
import './Deals.scss';

const Deals = () => {
    const [cards, setCards] = useState<Customer[]>([]);
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

    return (
        <div className="deals">
            <div className="options">
                <div className="change-view">
                    <button className="board-view">
                        <span className="material-symbols-outlined">
                            view_column
                        </span>
                    </button>
                    <button className="list-view">
                        <span className="material-symbols-outlined">
                            list
                        </span>
                    </button>
                    <button className="table-view">
                        <span className="material-symbols-outlined">
                            view_module
                        </span>
                    </button>
                </div>

                <button className="add-card">
                    + Deal
                </button>
            </div>
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
        </div>
    );
}

export default Deals;