import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { deleteOne, insertOne } from "../methods/methods";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
import Loader from "../components/Loader";
import { DataContext } from "../App";

const Event = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { setType, setIsActionModal } = useContext(DataContext);

  const addEvent = async () => {
    if (eventTitle && eventDate) {
      const isAdd = insertOne("events", {
        title: eventTitle,
        start: eventDate,
      });
      if (isAdd) {
        setEventTitle("");
        setEventDate("");
        setType(4);
        setIsActionModal(true);
      } else {
        setType(5);
        setIsActionModal(true);
      }
    } else {
      setType(12);
      setIsActionModal(true);
      return;
    }
  };

  useEffect(() => {
    const collectionRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(items);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "65%" }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={true}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          style={{
            width: "30%",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <h3>Add Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            style={{ width: "100%", marginTop: "10px", padding: "8px" }}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={{ width: "100%", marginTop: "10px", padding: "8px" }}
          />
          <button
            onClick={addEvent}
            style={{ width: "100%", marginTop: "10px", padding: "8px" }}
          >
            Add Event
          </button>

          <h3 style={{ marginTop: "16px" }}>Delete Event</h3>

          {events.map((e) => (
            <button
              title="Click to delete event"
              style={{ width: "100%", marginTop: "10px", padding: "8px" }}
              onClick={() => deleteOne("events", e.id)}
            >
              {e.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
