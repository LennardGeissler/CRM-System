import React, { useState, useEffect } from "react";
import './Tasks.scss';

interface Task {
    ID: number,
    Aufgabe: string,
    Person: 'Lennard Geißler' | 'Cedric Bergmann',
    Unteraufgaben: string,
    Deadline: string,
    Status: 'Ausstehend' | 'Nicht begonnen' | 'In Bearbeitung',
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [personFilter, setPersonFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<string>('asc');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/tasks');
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

    return (
        <div className="tasks-container">
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
        </div>
    );
}

export default Tasks