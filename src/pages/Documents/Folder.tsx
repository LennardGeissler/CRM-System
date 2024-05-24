import React, { useState } from "react";
import './Folder.scss';

const Folder = ({ name, children }: { name?: any, children?: any }) => {
  const [toggleFolder, setToggleFolder] = useState(true);

  const handleToggleFolder = (event:any) => {
    event.stopPropagation();
    setToggleFolder(!toggleFolder);
  }

  return (
    <div className="folder" onClick={handleToggleFolder}>
      <div className="folder-name">
        <i className="folder-icon"><img src="src\assets\images\folder.png" alt="" /></i>
        <span>{name}</span>
      </div>
      {toggleFolder && <div className="folder-contents">{children}</div>}
    </div>
  );
}

export default Folder;