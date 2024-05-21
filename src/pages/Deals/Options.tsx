import React from "react";
import { Customer } from "../../utils/data-card";

interface OptionsProps {
    view: string;
    changeView: (view: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    cards: Customer[];
}

const Options: React.FC<OptionsProps> = ({ view, changeView, setIsModalOpen, cards }) => {
    return (
        <div className="options">
                <div className="left">
                    <div className="change-view">
                        <button className={view === "board" ? "active board-view" : "board-view"} onClick={() => changeView('board')}>
                            <span className="material-symbols-outlined">
                                view_column
                            </span>
                        </button>
                        <button className={view === "list" ? "active list-view" : "list-view"} onClick={() => changeView('list')}>
                            <span className="material-symbols-outlined">
                                list
                            </span>
                        </button>
                        <button className={view === "table" ? "active table-view" : "table-view"} onClick={() => changeView('table')}>
                            <span className="material-symbols-outlined">
                                view_module
                            </span>
                        </button>
                    </div>

                    <button className="add-card" onClick={() => setIsModalOpen(true)}>
                        + Deal
                    </button>
                </div>
                <div className="right">
                    <div className="numbers">
                        <span>{cards.reduce((accumulator, currentCard) => accumulator + currentCard.Wert, 0).toLocaleString()} €</span>
                        <span>~</span>
                        <span>{cards.length} Deals</span>
                    </div>
                </div>
            </div>
    );
}

export default Options;