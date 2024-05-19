import React, { useState, useEffect } from "react";
import './SideBar.scss';

interface SideBarProps {
    handleLogout: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ handleLogout }) => {
    const [pathname, setPathname] = useState(window.location.pathname);

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
        <aside>
            <div className="top">
                <img src="src/assets/images/logo-bsp.png" alt="" />
            </div>

            <div className="middle">
                <nav>
                    <ul>
                        <li>
                            <a href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    dashboard
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/deals" className={pathname === '/deals' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    monetization_on
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/tasks" className={pathname === '/tasks' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    task
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/stats" className={pathname === '/stats' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    query_stats
                                </span>
                            </a>
                        </li>

                        <div className="seperator">
                            <div></div>
                        </div>

                        <li>
                            <a href="/mail" className={pathname === '/mail' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    mail
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/calendar" className={pathname === '/calendar' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    event
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/contacts" className={pathname === '/contacts' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    id_card
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/documents" className={pathname === '/documents' ? 'active' : ''}>
                                <span className="material-symbols-outlined">
                                    attach_file
                                </span>
                            </a>
                        </li>

                        <div className="bottom">
                            <li>
                                <a href="/settings" className={pathname === '/settings' ? 'active' : ''}>
                                    <span className="material-symbols-outlined">
                                        settings
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="/login" onClick={handleLogout}>
                                    <span className="material-symbols-outlined">
                                        logout
                                    </span>
                                </a>
                            </li>

                        </div>
                    </ul>
                </nav>
            </div>
        </aside >
    );
}

export default SideBar;