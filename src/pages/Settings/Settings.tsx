import React from "react";
//import './Settings.scss';

const Settings = () => {
    return (
        <div className="settings">
            <nav className="menu">
                <ul>
                    <li>
                        <a href="/settings/general">
                            <span>General</span>
                        </a>
                    </li>
                    <li>
                        <a href="/settings/profile">
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="/settings/appearance">
                            <span>Appearance</span>
                        </a>
                    </li>
                    <li>
                        <a href="/settings/about">
                            <span>About</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="main">

            </div>
        </div>
    )
}

export default Settings;