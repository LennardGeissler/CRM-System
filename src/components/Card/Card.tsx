// Card.js
import React, { useState } from 'react';
import { Customer } from '../../utils/data-card';
import './Card.scss';

const Card = ({ card, updateCard }: { card: Customer, updateCard: (card: Customer) => void }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)

    const handleDragStart = (e: any, id: any) => {
        e.dataTransfer.setData("id", id);
    };

    return (
        <div key={card.KundenID} className="card" draggable onDragStart={(e) => handleDragStart(e, card.KundenID)}>
            <div className="information">
                <div className="person">
                    {isEditingTitle ? (<input autoFocus onBlur={() => setIsEditingTitle(false)} value={card.Kundenname} onChange={(e) => updateCard({ ...card, Kundenname: e.target.value })} />) : (<div onClick={() => setIsEditingTitle(true)}>{card.Kundenname}</div>)}
                </div>
                <p className='company'>{card.Unternehmen}</p>
                <div className="money">
                    <span className="material-symbols-outlined">
                        account_circle
                    </span>
                    <p>{card.Wert.toLocaleString()} €</p>
                </div>
            </div>
            <button className="action">
                <a href="/contacts">
                    <span className="material-symbols-outlined">
                        arrow_circle_right
                    </span>
                </a>
            </button>
        </div>
    );
};

export default Card;
