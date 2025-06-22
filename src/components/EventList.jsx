import React, { useState, useEffect } from "react";
import "./EventList.css";
import Picture1 from "../assets/pictures/26 event/Aleph_Icon.webp";
import Picture2 from "../assets/pictures/26 event/Aleph cube.png";
import Picture3 from "../assets/pictures/26 event/Bette cube.png";

class PriorityQueue {
  constructor() {
    this.queue = [];
    this.counter = 0;
  }

  enqueue(item, priority) {
    this.queue.push({ item, priority, timestamp: this.counter++ });
  }

  dequeue(mode = "highest") {
    if (this.queue.length === 0) return null;
    return this._getElement(mode, true);
  }

  peek(mode = "highest") {
    if (this.queue.length === 0) return null;
    return this._getElement(mode, false);
  }

  _getElement(mode, remove) {
    let index = 0;
    if (mode === "highest") {
      index = this.queue.reduce(
        (bestIdx, el, i, arr) =>
          el.priority > arr[bestIdx].priority ? i : bestIdx,
        0
      );
    } else if (mode === "lowest") {
      index = this.queue.reduce(
        (bestIdx, el, i, arr) =>
          el.priority < arr[bestIdx].priority ? i : bestIdx,
        0
      );
    } else if (mode === "oldest") {
      index = this.queue.reduce((oldestIdx, el, i, arr) =>
        el.priority < arr[oldestIdx].priority ? i : (oldestIdx = 0)
      );
    } else if (mode === "newest") {
      index = this.queue.reduce(
        (newestIdx, el, i, arr) =>
          el.timestamp > arr[newestIdx].timestamp ? i : newestIdx,
        0
      );
    }

    const element = this.queue[index];
    if (remove) this.queue.splice(index, 1);
    return element.item;
  }

  getAllSortedBy(mode = "highest") {
    const result = [];
    while (this.queue.length) {
      result.push(this.dequeue(mode));
    }
    return result;
  }
}

const formatDateDiff = (startStr, endStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : null;
  const diffStart = Math.floor((start - today) / (1000 * 60 * 60 * 24));
  const diffEnd = end
    ? Math.floor((end - today) / (1000 * 60 * 60 * 24))
    : null;

  if (end && diffEnd < 0) {
    return { text: "", color: "red", visible: false };
  }

  if (diffStart <= 3) {
    const dayLeft = (diffEnd ?? 0) + 1;
    return {
      text: dayLeft,
      color: diffStart > 0 ? "gray" : "green",
      visible: true,
    };
  }
  return {
    text: diffStart,
    color: "gray",
    visible: false,
  };
};
const EventItem = ({ event }) => {
  const { text, color, visible } = formatDateDiff(event.start, event.end);
  if (!visible) {
    return null;
  }

  return (
    <li>
      <span className="date" style={{ color }}>
        {event.title}
      </span>
    </li>
  );
};

const EventList = () => {
  const [sortedEvents, setSortedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/generator/events?duration=5"
        );
        const data = await res.json();

        const pq = new PriorityQueue();
        data.collected.forEach((event) => pq.enqueue(event, event.priority));
        const sorted = pq.getAllSortedBy("highest");
        setSortedEvents(sorted);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="recent-updates">
      <div className="recent-updates">
        <h2>Recently Updated</h2>
        <div className="avatars">
          <img src={Picture1} alt="Avatar 1" />
          <img src={Picture2} alt="Avatar 2" />
          <img src={Picture3} alt="Avatar 3" />
        </div>

        <ul>
          {sortedEvents.map((event, index) => (
            <EventItem key={index} event={event} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EventList;
