import React from 'react';

export type Status = 'Ausstehend' | 'Nicht begonnen' | 'In Bearbeitung';

interface Task {
    ID: number,
    Aufgabe: string,
    Person: 'Lennard Geißler' | 'Cedric Bergmann',
    Unteraufgaben: string, // Change Unteraufgaben to an array of objects
    Deadline: string,
    Status: Status,
}

export const statuses: Status[] = ['Ausstehend', 'Nicht begonnen', 'In Bearbeitung'];

const AddTasks = ({ newCard, setNewCard, addCard, setIsModalOpen }: { newCard: any, setNewCard: any, addCard: any, setIsModalOpen: any }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                <h2>Task hinzufügen</h2>
                <form onSubmit={addCard}>
                    <label>
                        <p>Aufgabe:</p>
                        <input type="text" value={newCard.Aufgabe} onChange={(e) => setNewCard({ ...newCard, Aufgabe: e.target.value })} required />
                    </label>
                    <label>
                        <p>Person:</p>
                        <input type="text" value={newCard.Person} onChange={(e) => setNewCard({ ...newCard, Person: e.target.value })} required />
                    </label>
                    <label>
                        <p>Unteraufgaben:</p>
                        <input type="text" value={newCard.Unteraufgaben} onChange={(e) => setNewCard({ ...newCard, Unteraufgaben: e.target.value })} required />
                    </label>
                    <label>
                        <p>Deadline:</p>
                        <input type="date" value={newCard.Date} onChange={(e) => setNewCard({ ...newCard, Deadline: e.target.value })} required />
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
                    <button type="submit">Task hinzufügen</button>
                </form>
            </div>
        </div>
    );
}

export default AddTasks;