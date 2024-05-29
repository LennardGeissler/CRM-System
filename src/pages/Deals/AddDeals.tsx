import React from 'react';
import { Status, statuses } from '../../utils/data-card';

const AddDeals = ({ newCard, setNewCard, addCard, setIsModalOpen } : {newCard:any, setNewCard:any, addCard:any, setIsModalOpen:any}) => {
    return (
        <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Deal hinzufügen</h2>
                        <form onSubmit={addCard}>
                            <label>
                                <p>Person:</p>
                                <input type="text" value={newCard.Kundenname} onChange={(e) => setNewCard({ ...newCard, Kundenname: e.target.value })} required />
                            </label>
                            <label>
                                <p>Company:</p>
                                <input type="text" value={newCard.Unternehmen} onChange={(e) => setNewCard({ ...newCard, Unternehmen: e.target.value })} required />
                            </label>
                            <label>
                                <p>Money:</p>
                                <input type="number" value={newCard.Wert} onChange={(e) => setNewCard({ ...newCard, Wert: parseInt(e.target.value) })} required />
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
                            <button type="submit">Card hinzufügen</button>
                        </form>
                    </div>
                </div>
    );
}

export default AddDeals;