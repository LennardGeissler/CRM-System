import React, { useState, useEffect } from "react";
import './SideBar.scss';

interface SideBarProps {
    handleLogout: () => void;
    sideBar: boolean;
    setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ handleLogout, sideBar, setSideBar }) => {
    const [pathname, setPathname] = useState(window.location.pathname);

    useEffect(() => {
        if (window.screen.width > 480) {
            sideBar = true;
        }
        console.log(sideBar);

        const handleLocationChange = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };

    }, []);

    return (
        <div className="sidebar-outer">
            <div className={sideBar ? 'sidebar-active sidebar-inner' : 'sidebar-inner'}>
                <aside>
                    <div className="aside-inner">
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
                                        <a href="/aufgaben" className={pathname === '/aufgaben' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                task
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/projekte" className={pathname === '/projekte' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                deployed_code
                                            </span>
                                        </a>
                                    </li>
                                    <div className="seperator">
                                        <div></div>
                                    </div>
                                    <li>
                                        <a href="/kalender" className={pathname === '/kalender' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                event
                                            </span>
                                        </a>
                                    </li>
                                    <li className="customers">
                                        <a href="/privatkunden" className={pathname === '/privatkunden' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                id_card
                                            </span>
                                            <div>
                                                P
                                            </div>
                                        </a>
                                    </li>
                                    <li className="customers">
                                        <a href="/firmenkunden" className={pathname === '/firmenkunden' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                id_card
                                            </span>
                                            <div>
                                                U
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/dokumente" className={pathname === '/dokumente' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                attach_file
                                            </span>
                                        </a>
                                    </li>

                                    <div className="bottom">
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
                    </div>
                </aside >
            </div>
        </div>
    );
}

export default SideBar;