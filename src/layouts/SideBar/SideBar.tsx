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
                                        <a href="/tasks" className={pathname === '/tasks' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                task
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/projects" className={pathname === '/projects' ? 'active' : ''}>
                                            <span className="material-symbols-outlined">
                                                deployed_code
                                            </span>
                                        </a>
                                    </li>
                                    <div className="seperator">
                                        <div></div>
                                    </div>
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