import React, { useState, useEffect } from "react";
import BoardView from "../Tasks/Views/BoardView";
import './Tasks.scss';
import AddTasks from "./AddTasks";

export type Status = 'Ausstehend' | 'Nicht begonnen' | 'In Bearbeitung';

interface Task {
    ID: number,
    Aufgabe: string,
    Person: 'Lennard Geißler' | 'Cedric Bergmann',
    Unteraufgaben: '',
    Deadline: string,
    Status: Status,
}

export const statuses: Status[] = ['Ausstehend', 'Nicht begonnen', 'In Bearbeitung'];

const initialNewCardState: Omit<Task, 'ID'> = {
    Aufgabe: '',
    Person: 'Lennard Geißler',
    Unteraufgaben: '',
    Deadline: new Date().toISOString(),
    Status: statuses[0]
};

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [personFilter, setPersonFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [view, setView] = useState<string>('gallery');
    const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
    const [newCard, setNewCard] = useState(initialNewCardState);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://192.168.178.58:3000/tasks');
                const data = await response.json();
                setTasks(data);
                setFilteredTasks(data);
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Aufgaben!', error);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [personFilter, statusFilter]);

    const filterTasks = () => {
        let updatedTasks: Task[] = tasks;

        if (personFilter) {
            updatedTasks = updatedTasks.filter(task => task.Person === personFilter);
        }

        if (statusFilter) {
            updatedTasks = updatedTasks.filter(task => task.Status === statusFilter);
        }

        setFilteredTasks(updatedTasks);
    };

    const handleSort = (sortBy: string) => {
        const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
            const dateA = new Date(a[sortBy]);
            const dateB = new Date(b[sortBy]);

            if (sortOrder === 'asc') {
                return dateA.getTime() - dateB.getTime();
            } else {
                return dateB.getTime() - dateA.getTime();
            }
        });

        setFilteredTasks(sortedTasks);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const getStatusClass = (status: Task['Status']) => {
        switch (status) {
            case 'Ausstehend':
                return 'status-red';
            case 'Nicht begonnen':
                return 'status-blue';
            case 'In Bearbeitung':
                return 'status-green';
            default:
                return '';
        }
    };

    const handleCardClick = (taskId: number) => {
        setFlippedCards(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
        e.dataTransfer.setData('taskId', taskId.toString());
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const updatedTasks = tasks.map(task => {
            if (task.ID === taskId) {
                task.Status = status;
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const subtasksArray = newCard.Unteraufgaben
                .split(',')
                .map((name: string) => ({ name }));

            console.log(subtasksArray)
            const response = await fetch('http://192.168.178.58:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newCard,
                    Unteraufgaben: JSON.stringify(subtasksArray)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add card');
            }

            const data = await response.json();
            const newCardWithId = { ...newCard, ID: data.ID };

            setTasks([...tasks, newCardWithId]);
            setIsModalOpen(false);
            setNewCard(initialNewCardState);

        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            const response = await fetch(`http://192.168.178.58:3000/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            setTasks(tasks.filter(task => task.ID !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="tasks-container">
            <div className="options">
                <div className="change-view">
                    <button className={view === "board" ? "active board-view" : "board-view"} onClick={() => setView('board')}>
                        <span className="material-symbols-outlined">
                            view_column
                        </span>
                    </button>
                    <button className={view === "gallery" ? "active gallery-view" : "gallery-view"} onClick={() => setView('gallery')}>
                        <span className="material-symbols-outlined">
                            view_day
                        </span>
                    </button>
                    <button className={view === "table" ? "active table-view" : "table-view"} onClick={() => setView('table')}>
                        <span className="material-symbols-outlined">
                            view_module
                        </span>
                    </button>
                </div>

                <button className="add-card" onClick={() => setIsModalOpen(true)}>
                    + Task
                </button>
            </div>
            {view == 'table' && (
                <table>
                    <thead>
                        <tr>
                            <th>Aufgabe</th>
                            <th>Person
                                <label>
                                    <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
                                        <option value="">Alle</option>
                                        <option value="Lennard Geißler">Lennard Geißler</option>
                                        <option value="Cedric Bergmann">Cedric Bergmann</option>
                                    </select>
                                </label>
                            </th>
                            <th>Unteraufgaben</th>
                            <th>Fälligkeitsdatum
                                <button onClick={() => handleSort('Deadline')}>
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </th>
                            <th>Status
                                <label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="">Alle</option>
                                        <option value="Ausstehend">Ausstehend</option>
                                        <option value="Nicht begonnen">Nicht begonnen</option>
                                        <option value="In Bearbeitung">In Bearbeitung</option>
                                    </select>
                                </label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.ID}>
                                <td>{task.Aufgabe}</td>
                                <td>{task.Person}</td>
                                <td>{JSON.parse(task.Unteraufgaben).map((subtask: any) => subtask.name).join(', ')}</td>
                                <td>{task.Deadline.split('T')[0]}</td>
                                <td>{task.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {view === 'gallery' && (
                <div className="gallery">
                    {filteredTasks.map(task => (
                        <div
                            className={`taskcard ${flippedCards[task.ID] ? 'flipped' : ''}`}
                            key={task.ID}
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
                                    <button className={`status ${getStatusClass(task.Status)}`}>
                                        {task.Status == 'Ausstehend' && (
                                            <span>Ausstehend</span>
                                        )}
                                        {task.Status == 'Nicht begonnen' && (
                                            <span>Nicht begonnen</span>
                                        )}
                                        {task.Status == 'In Bearbeitung' && (
                                            <span>In Bearbeitung</span>
                                        )}
                                    </button>
                                    <button className="cmd-delete" onClick={(e) => {
                                        e.stopPropagation(); // Prevent the card click event
                                        deleteTask(task.ID);
                                    }}>
                                        <span className="material-symbols-outlined delete-icon">
                                            delete
                                        </span>
                                    </button>
                                </div>
                                <div className="card-back">
                                    <p><strong>Person:</strong> {task.Person}</p>
                                    <p><strong>Fälligkeitsdatum:</strong> {task.Deadline.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {view === 'board' && (
                <BoardView tasks={filteredTasks}
                    handleDrop={handleDrop}
                    handleDragStart={handleDragStart}
                    handleCardClick={handleCardClick} />
            )}
            {isModalOpen && <AddTasks newCard={newCard} setNewCard={setNewCard} addCard={addTask} setIsModalOpen={setIsModalOpen} />}
        </div>
    );
}

export default Tasks;