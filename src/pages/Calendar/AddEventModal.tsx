// AddEventModal.tsx
import React, { useState } from 'react';

interface AddEventModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (title: string, start: Date, end: Date) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ show, handleClose, handleSave }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(title, new Date(start), new Date(end));
    handleClose();
    console.log(title, new Date(start), new Date(end))
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Neuen Termin hinzufügen</h2>
        <form onSubmit={onSave}>
          <label>
            <p>Terminname:</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            <p>Start:</p>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>
          <label>
            <p>Ende:</p>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </label>
          <div className="line"></div>
          <button type="submit">Termin hinzufügen</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
