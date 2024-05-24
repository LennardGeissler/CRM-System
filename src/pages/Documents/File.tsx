import './File.scss';

const File = ({ name } : {name?:any}) => {
    return (
        <div className="file">
            <i className="file-icon"><img src="src\assets\images\document.png" alt="" /></i>
            <span>{name}</span>
        </div>
    );
};

export default File;