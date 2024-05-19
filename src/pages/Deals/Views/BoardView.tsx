import React from "react";
import Card from "../../../components/Card/Card";
import { Customer, Status, statuses } from "../../../utils/data-card";

interface BoardViewProps {
    cards: Customer[];
    handleDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => Promise<void>;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, KundenID: string) => void;
    updateCard: (card: Customer) => Promise<void>;
}

const BoardView: React.FC<BoardViewProps> = ({ cards, handleDrop, handleDragStart, updateCard }) => {
    const columns = statuses.map((status) => ({
        status,
        cards: cards.filter((card) => card.Status === status),
    }));

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

export default BoardView;