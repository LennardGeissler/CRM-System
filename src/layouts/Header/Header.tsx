import React, { useState, useEffect } from "react";
import './Header.scss';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pathname, setPathname] = useState(window.location.pathname);

    const handleInputChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // Hier kannst du die Suchlogik implementieren, z.B. API-Anfrage
        console.log('Suche nach:', searchTerm);
    };

    useEffect(() => {
        const handleLocationChange = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

    return (
        <header>
            <h1>{pathname[1].toUpperCase() + pathname.slice(2)}</h1>

            <form className="search-bar" onSubmit={handleSubmit}>
                <span className="material-symbols-outlined">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Suche..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </form>

            <div className="profile">
                <img src="src/assets/images/lennard.png" alt="" />
                <div className="info">
                    <p className="name">Lennard Geißler</p>
                    <p className="position">CRM-Entwickler</p>
                </div>
            </div>
        </header>
    )
}

export default Header;