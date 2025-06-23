import React, { useState } from "react";
import "./PriorityEvent.css";
import Picture1 from "../assets/pictures/26 event/Aleph_Icon.webp";
import Picture2 from "../assets/pictures/26 event/Aleph cube.png";
import Picture3 from "../assets/pictures/26 event/Bette cube.png";

const API_URL = import.meta.env.VITE_API_URL;

function PriorityEvent(props) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    priority: 5,
  });
  const [event, setEvent] = useState(null);
  const [mode, setMode] = useState("highest");
  const fetchEvent = async (selectedMode) => {
    try {
      const res = await fetch(`${API_URL}/priority/peek?mode=${selectedMode}`);
      const data = await res.json();
      setEvent(data.item || null);
      setMode(selectedMode);
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };
  const dequeueEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/priority/dequeue?mode=${mode}`);
      const data = await res.json();
      setEvent(data.item || null);
    } catch (err) {
      console.error("Failed to dequeue event:", err);
    }
  };
  const handleAddEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/priority/enqueue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: {
            title: newEvent.title,
            start: newEvent.start,
            priority: parseInt(newEvent.priority),
          },
          priority: parseInt(newEvent.priority),
        }),
      });

      if (!res.ok) throw new Error("Failed to add event");
      setNewEvent({ title: "", start: "", priority: 5 });

      await fetchEvent(mode);

      alert("Add event");
    } catch (err) {
      console.error("Add error:", err);
      alert("Error");
    }
  };
  return (
    <section className="recent-updates">
      <div className="recent-updates">
        <h2>Event Peek (Mode: {mode})</h2>
        <div className="avatars">
          <img src={Picture1} alt="Avatar 1" />
          <img src={Picture2} alt="Avatar 2" />
          <img src={Picture3} alt="Avatar 3" />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => fetchEvent("highest")}>Highest</button>
          <button onClick={() => fetchEvent("lowest")}>Lowest</button>
          <button onClick={() => fetchEvent("newest")}>Newest</button>
          <button onClick={dequeueEvent}>Dequeue</button>
        </div>
        <div style={{ margin: "1rem 0" }}>
          <h4>Add New Event</h4>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <input
            type="date"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
          />
          <input
            type="number"
            min="1"
            max="10"
            value={newEvent.priority}
            onChange={(e) =>
              setNewEvent({ ...newEvent, priority: e.target.value })
            }
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
        <ul>
          {event ? (
            <li>
              <strong>{event.title}</strong>
              {event.start && <span> — Starts: {event.start}</span>}
            </li>
          ) : (
            <li>No event loaded</li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default PriorityEvent;
