import React from "react";
import '../Tasks.scss'

export type Status = 'Ausstehend' | 'Nicht begonnen' | 'In Bearbeitung';

interface Task {
    ID: number;
    Aufgabe: string;
    Person: 'Lennard Geißler' | 'Cedric Bergmann';
    Unteraufgaben: string;
    Deadline: string;
    Status: Status;
}

interface BoardViewProps {
    tasks: Task[];
    handleDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
    handleCardClick: (id: number) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, handleDrop, handleDragStart, handleCardClick }) => {
    const statuses: Status[] = ['Ausstehend', 'Nicht begonnen', 'In Bearbeitung'];
    const columns = statuses.map((status) => ({
        status,
        tasks: tasks.filter((task) => task.Status === status),
    }));

    return (
        <div className="board">
            {columns.map(column => (
                <div
                    key={column.status}
                    onDrop={(e) => handleDrop(e, column.status)}
                    onDragOver={(e) => e.preventDefault()}
                    className="column"
                >
                    <h2>{column.status}</h2>
                    <div className="taskcards">
                        {column.tasks.map(task => (
                            <div
                                key={task.ID}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.ID)}
                                className="taskcard"
                                onClick={() => handleCardClick(task.ID)}
                            >
                                <div className="card-inner">
                                    <div className="card-front">
                                        <h3>{task.Aufgabe}</h3>
                                        <ul>
                                            {JSON.parse(task.Unteraufgaben).map((subtask: any) => (
                                                <li key={subtask.id}>{subtask.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-back">
                                        <p><strong>Person:</strong> {task.Person}</p>
                                        <p><strong>Fälligkeitsdatum:</strong> {task.Deadline.split('T')[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BoardView;