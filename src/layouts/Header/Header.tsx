import React, { useState, useEffect } from "react";
import './Header.scss';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pathname, setPathname] = useState(window.location.pathname);
    const [employee, setEmployee] = useState([]);

    useEffect(() => {
        const fetchConnectionData = async () => {
            try {
                const response = await fetch('http://localhost:3000');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployee(data.recordset);
            } catch (error) {
                console.error('There was an error fetching the connection data!', error);
            }
        };

        fetchConnectionData();
    }, []);

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

    const getPageTitle = (pathname: string) => {
        if (pathname.length > 1) {
            return pathname[1].toUpperCase() + pathname.slice(2);
        }
        return 'Dashboard';
    };

    return (
        <header>
            <h1>{getPageTitle(pathname)}</h1>
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