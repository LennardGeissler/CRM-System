// CustomToolbar.tsx
import React from 'react';
import { ToolbarProps } from 'react-big-calendar';

interface CustomToolbarProps extends ToolbarProps {
  onAddEvent: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView, onAddEvent }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView('month')}>Month</button>
        <button type="button" onClick={() => onView('week')}>Week</button>
        <button type="button" onClick={() => onView('day')}>Day</button>
      </span>
      <span className="rbc-btn-group">
        <button type="button" onClick={onAddEvent}>Add Event</button>
      </span>
    </div>
  );
};

export default CustomToolbar;
