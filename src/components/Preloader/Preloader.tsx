import React from "react";
import './Preloader.scss';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="progress">
                <div className="color"></div>
            </div>
        </div>
    );
}

export default Preloader;