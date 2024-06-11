import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CustomToolbar from './CustomToolbar';
import AddEventModal from './AddEventModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PersonalCalendar.scss';

moment.updateLocale('de', {
    week: {
        dow: 1, // Monday is the first day of the week
    },
});

const localizer = momentLocalizer(moment);


interface Event {
    EventID?: number,
    Title: string;
    Start: Date;
    End: Date;
}

const PersonalCalendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ left: number; top: number } | null>(null);
    const [modalShow, setModalShow] = useState<boolean>(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events');
            if (response.ok) {
                const data = await response.json();
                // Adjust the data format if necessary
                const formattedEvents = data.map((event: Event) => ({
                    EventID: event.EventID,
                    Title: event.Title,
                    Start: new Date(event.Start),
                    End: new Date(event.End),
                }));
                setEvents(formattedEvents);
            } else {
                console.error('Error fetching events:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleAddEvent = async (title: string, start: Date, end: Date) => {
        try {
            const newEvent: Event = { Title: title, Start: start, End: end };
            const response = await fetch('http://localhost:3000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });
            const result = await response.json();
            if (result.success) {
                setEvents([...events, newEvent]);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const handleDeleteEvent = async () => {
        if (selectedEvent) {
            try {
                const response = await fetch(`http://localhost:3000/events/${selectedEvent.EventID}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setEvents(events.filter(event => event.EventID !== selectedEvent.EventID));
                } else {
                    console.error('Error deleting event:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
        setContextMenuPosition(null);
        setSelectedEvent(null);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setContextMenuPosition({ left: event.clientX, top: event.clientY });
    };

    const CustomDateHeader = ({ label }: { label: string }) => {
        // Extract the date part from the label
        const date = label.split(' ')[0];
        return <div>{date}</div>;
    };

    const formats = {
        timeGutterFormat: 'HH:mm', // Formats time in the gutter (left side)
        eventTimeRangeFormat: ({ start, end } : {start:any, end:any}, culture:any, localizer:any) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
        agendaTimeRangeFormat: ({ start, end }: {start:any, end:any}, culture:any, localizer:any) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
        dayHeaderFormat: 'dddd, MMMM Do', // Customize day header format if needed
    };

    return (
        <div className="calendar-outer" onContextMenu={handleContextMenu}>
            <Calendar
                localizer={localizer}
                events={events}
                titleAccessor="Title"
                startAccessor="Start"
                endAccessor="End"
                className="calendar"
                views={['month', 'week', 'day']}
                defaultView="week"
                showMultiDayTimes
                components={{
                    toolbar: (props) => <CustomToolbar {...props} onAddEvent={() => setModalShow(true)} />,
                    week: {
                        header: CustomDateHeader,
                    },
                }}
                formats={formats}
                onSelectEvent={event => setSelectedEvent(event)} // Handle event selection
            />
            <AddEventModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSave={handleAddEvent}
            />
            {contextMenuPosition && selectedEvent && (
                <div
                    style={{
                        position: 'fixed',
                        left: contextMenuPosition.left,
                        top: contextMenuPosition.top,
                        cursor: 'pointer',
                        backgroundColor: 'var(--surface-background)',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '8px',
                        borderRadius: '4px',
                        zIndex: 1000,
                    }}
                >
                    <div onClick={handleDeleteEvent}>Delete Event</div>
                </div>
            )}
        </div>
    );
}

export default PersonalCalendar;