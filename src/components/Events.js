import React from "react";
import "../css/eventscom.css";

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h3 className="event-title">{event.value.title}</h3>
      <p className="event-detail">
        <span className="icon">📅</span> {event.value.start}
      </p>
    </div>
  );
};

const EventDashboard = ({ events }) => {
  console.log(events);
  return (
    <div className="event-dashboard">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventDashboard;
