import React from "react";
import Card from "../../../components/Card/Card";
import { Customer, Status, statuses } from "../../../utils/data-card";

interface TableViewProps {
    cards: Customer[];
    handleDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => Promise<void>;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, KundenID: string) => void;
    updateCard: (card: Customer) => Promise<void>;
}

const TableView: React.FC<TableViewProps> = ({ cards, handleDrop, handleDragStart, updateCard }) => {
    const columns = statuses.map((status) => ({
        status,
        cards: cards.filter((card) => card.Status === status),
    }));
    
    return (
        <div className="table">

        </div>
    );
}

export default TableView;