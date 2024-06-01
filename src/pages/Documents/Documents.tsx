import React, { useState } from "react";
import Folder from "./Folder";
import File from "./File";
import './Documents.scss';

const Documents = () => {
    const [rotation1, setRotation1] = useState(0);
    const [closed1, setClosed1] = useState(false);
    const [rotation2, setRotation2] = useState(0);
    const [closed2, setClosed2] = useState(false);
    const [toggleOptions, setToggleOptions] = useState(false);

    const handleClick1 = () => {
        if (rotation1 == 0) {
            setRotation1(-90);
            setClosed1(true);
        } else {
            setRotation1(0);
            setClosed1(false);
        }
    }

    const handleClick2 = () => {
        if (rotation2 == 0) {
            setRotation2(-90);
            setClosed2(true);
        } else {
            setRotation2(0);
            setClosed2(false);
        }
    }

    const handletoggleOptions = () => {
        setToggleOptions(!toggleOptions);
    }

    return (
        <div className="documents-container">
            <div className="folders">
                <h2 className="file-explorer">Dateiverzeichnis</h2>
                <div className="line"></div>
                <Folder name="Kunden">
                    <Folder name="Verträge">
                        <Folder name="Rahmenverträge">
                            <File name="Rahmenvertrag 1.pdf" />
                            <File name="Rahmenvertrag 2.pdf" />
                        </Folder>
                        <Folder name="Projektverträge">
                            <File name="Projektplan 1.pdf" />
                            <File name="Projektplan 2.pdf" />
                        </Folder>
                        <Folder name="NDA" />
                    </Folder>
                    <Folder name="Projekte">
                        <Folder name="Max Mustermann">
                            <Folder name="Projektpläne" />
                            <Folder name="Anforderungsdokumente" />
                            <Folder name="Design-Dokumente" />
                            <Folder name="Entwicklungsdokumente" />
                            <Folder name="Testberichte" />
                            <Folder name="Übergabedokumente" />
                        </Folder>
                    </Folder>
                    <Folder name="Rechnungen">
                        <Folder name="Angebot" />
                        <Folder name="Rechnungen" />
                        <Folder name="Zahlungsnachweise" />
                    </Folder>
                </Folder>
            </div>
            <div className="file-container">
                <div className="file-inner">
                    <div className="dropdown-menu" style={toggleOptions ? { width: "25%" } : { width: "30px", height: "30px" }}>
                        <button className="toggle" onClick={handletoggleOptions}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <div className="file-options" style={toggleOptions ? { display: "block" } : { display: "none" }}>
                            <button className="uploadFile">
                                <p>Upload File</p>
                            </button>
                            <button className="showFile">
                                <p>Show / Edit File</p>
                            </button>
                            <button className="saveFile">
                                <p>Save File</p>
                            </button>
                            <button className="downloadFile">
                                <p>Download File</p>
                            </button>
                        </div>
                    </div>
                    <div className="current-file">

                    </div>
                </div>
            </div>
            <div className="options">
                <h2>Eigenschaften</h2>
                <div className="line"></div>
                <div className="options-inner">
                    <div className="option">
                        <button onClick={handleClick1} style={{ transform: `rotate(${rotation1}deg)` }}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <h4>Allgemein</h4>
                    </div>
                    <div className="file-information" style={closed1 ? { display: "none" } : { display: "block" }}>
                        <ul>
                            <li>
                                <div className="column1">
                                    <p>Dateiname</p>
                                </div>
                                <div className="column2">
                                    <span className="file-name">Projektplan XYZ</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Art des Belegs</p>
                                </div>
                                <div className="column2">
                                    <span className="receipt-type">Projektplan</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Erstellt am</p>
                                </div>
                                <div className="column2">
                                    <span className="created">20.05.2024</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Zuletzt bearbeitet am</p>
                                </div>
                                <div className="column2">
                                    <span className="edited-on">23.05.2024</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Zuletzt bearbeitet von</p>
                                </div>
                                <div className="column2">
                                    <span className="edited-from">Lennard Geißler</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Dateityp</p>
                                </div>
                                <div className="column2">
                                    <span className="file-type">PDF-Datei</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="option">
                        <button onClick={handleClick2} style={{ transform: `rotate(${rotation2}deg)` }}>
                            <span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>
                        </button>
                        <h4>Person</h4>
                    </div>
                    <div className="person" style={closed2 ? { display: "none" } : { display: "block" }}>
                        <ul>
                            <li>
                                <div className="column1">
                                    <p>Vorname</p>
                                </div>
                                <div className="column2">
                                    <span className="first-name">Max</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Nachname</p>
                                </div>
                                <div className="column2">
                                    <span className="last-name">Mustermann</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Kundennummer</p>
                                </div>
                                <div className="column2">
                                    <span className="customer-ID">1001</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Status</p>
                                </div>
                                <div className="column2">
                                    <span className="status">Qualified Lead</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Telefon</p>
                                </div>
                                <div className="column2">
                                    <span className="phone">+49 123 4567890</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>E-Mail</p>
                                </div>
                                <div className="column2">
                                    <span className="email">maxmustermann@gmail.com</span>
                                </div>
                            </li>
                            <li>
                                <div className="column1">
                                    <p>Land</p>
                                </div>
                                <div className="column2">
                                    <span className="country">Deutschland</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Documents