import React, { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PersonalCalendar.scss';

moment.updateLocale('de-de', {
    week: {
      dow: 1, // Monday is the first day of the week
    },
  });

const localizer = momentLocalizer(moment);

const PersonalCalendar = () => {
    const [events, setEvents] = useState([
        {
            title: 'Event 1',
            start: new Date(2024, 4, 20, 10, 0), // year, month (0-based), day, hour, minute
            end: new Date(2024, 4, 20, 12, 0),
        },
        {
            title: 'Event 2',
            start: new Date(2024, 4, 21, 14, 0),
            end: new Date(2024, 4, 21, 16, 0),
        },
    ]);

    return (
        //<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FBerlin&bgcolor=%23ffffff&showTitle=0&showTz=0&showCalendars=0&showPrint=0&src=Y3Jtc3lzdGVtLmRldmVsb3BtZW50QGdtYWlsLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uZ2VybWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%2333B679&color=%230B8043" frameBorder="0" scrolling="no"></iframe>
        <div className="calendar-outer">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                className="calendar"
                views={['month', 'week', 'day']}
                defaultView="week"
                showMultiDayTimes
                culture="de" // Ensure the locale is set correctly
            />
        </div>
    );
}

export default PersonalCalendar;