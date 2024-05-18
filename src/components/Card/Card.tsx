// Card.js
import React, { useState } from 'react';
import { Customer } from '../../utils/data-card';
import './Card.scss';

const Card = ({ card, updateCard }: { card: Customer, updateCard: (card: Customer) => void }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)

    return (
        <div key={card.id} className="card" draggable onDragStart={(e) => { e.dataTransfer.setData("id", card.id) }}>
            <div className="information">
                <div className="person">
                    {isEditingTitle ? (<input autoFocus onBlur={() => setIsEditingTitle(false)} value={card.person} onChange={(e) => updateCard({ ...card, person: e.target.value })} />) : (<div onClick={() => setIsEditingTitle(true)}>{card.person}</div>)}
                </div>
                <p className='company'>{card.company}</p>
                <div className="money">
                    <span className="material-symbols-outlined">
                        account_circle
                    </span>
                    <p>€ {card.money.toLocaleString()}</p>
                </div>
            </div>
            <button className="action">
                <span className="material-symbols-outlined">
                    chevron_right
                </span>
            </button>
        </div>
    );
};

export default Card;
