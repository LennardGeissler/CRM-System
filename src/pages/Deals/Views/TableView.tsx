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
            <table>
                <thead>
                    <tr>
                        <th>KundenID</th>
                        <th>Kundenname
                            {/* <label>
                                <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
                                    <option value="">Alle</option>
                                    <option value="Lennard Geißler">Lennard Geißler</option>
                                    <option value="Cedric Bergmann">Cedric Bergmann</option>
                                </select>
                            </label> */}
                        </th>
                        <th>Unternehmen</th>
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
                    {cards.map(card => (
                        <tr key={card.KundenID}>
                            <td>{card.KundenID}</td>
                            <td>{card.Kundenname}</td>
                            <td>{card.Unternehmen}</td>
                            <td>{card.Wert.toLocaleString()}</td>
                            <td>{card.Status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableView;