import React from "react";
import { MdEventBusy } from "react-icons/md";

const NoUpcomingEvents = () => {
  return (
    <div className="no-events-container">
      <MdEventBusy className="no-events-icon" />
      <p className="no-events-title">No Upcoming Events</p>
      <p className="no-events-text">You're all set for now. Enjoy your day!</p>
    </div>
  );
};

export default NoUpcomingEvents;
