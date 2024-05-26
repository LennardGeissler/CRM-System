// import React, { useState, useEffect } from "react";
// import './Projects.scss';

// interface Projects {

// }

// const Projects = () => {
//     const [projects, setProjects] = useState<[]>([]);
//     const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

//     const handleCardClick = (taskId: number) => {
//         setFlippedCards(prevState => ({
//             ...prevState,
//             [taskId]: !prevState[taskId]
//         }));
//     };

//     return (
//         <div className="gallery">
//                     {projects.map(task => (
//                         <div
//                             className={`card ${projects[projects.ID] ? 'flipped' : ''}`}
//                             key={task.ID}
//                             onClick={() => handleCardClick(task.ID)}
//                         >
//                             <div className="card-inner">
//                                 <div className="card-front">
//                                     <h3>{task.Aufgabe}</h3>
//                                     <ul>
//                                         {JSON.parse(task.Unteraufgaben).map((subtask: any) => (
//                                             <li key={subtask.id}>{subtask.name}</li>
//                                         ))}
//                                     </ul>
//                                     <button className={`status ${getStatusClass(task.Status)}`}>
//                                         {task.Status == 'Ausstehend' && (
//                                             <span>Ausstehend</span>
//                                         )}
//                                         {task.Status == 'Nicht begonnen' && (
//                                             <span>Nicht begonnen</span>
//                                         )}
//                                         {task.Status == 'In Bearbeitung' && (
//                                             <span>In Bearbeitung</span>
//                                         )}
//                                     </button>
//                                 </div>
//                                 <div className="card-back">
//                                     <p><strong>Person:</strong> {task.Person}</p>
//                                     <p><strong>Fälligkeitsdatum:</strong> {task.Deadline.split('T')[0]}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//     );
// }