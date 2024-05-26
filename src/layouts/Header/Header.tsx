import React, { useState, useEffect } from "react";
import './Header.scss';
import { useTheme } from "../../ThemeContext";
import ToggleThemeButton from "../../ToggleThemeButton";

interface HeaderProps {
    user: string | null;
    profileImages: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ user, profileImages }) => {
    const { theme, toggleTheme } = useTheme();
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

    const getPageTitle = (pathname: string) => {
        if (pathname.length > 1) {
            return pathname[1].toUpperCase() + pathname.slice(2);
        }
        return 'Dashboard';
    };

    return (
        <header className={theme}>
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
            <ToggleThemeButton />

            <div className="profile">
                <img src={user ? profileImages[user] : "default-profile-image-url"} alt="" /> {/* Provide a default profile image URL */}
                <div className="info">
                    <p className="name">{user}</p>
                    <p className="position">CRM-Entwickler</p>
                </div>
            </div>
        </header>
    )
}

export default Header;