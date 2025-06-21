import React from "react";
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

  const events = [
    {
      start: "2025.05.29",
      end: "2025.07.03",
      title: "The main part of the “Folie et Déraison” event is now open.",
      priority: 10,
    },
    {
      start: "2025.05.29",
      end: "2025.06.19",
      title: "Character banner “A Writing Writer Written” available.",
      priority: 7,
    },
    {
      start: "2025.05.29",
      end: "2025.06.19",
      title: "“Dialogues behind bars |” is now open.",
      priority: 6,
    },
    {
      start: "2025.05.29",
      end: "2025.06.19",
      title: "“Ruinas Gloriosas y Directices de Metáforas” is open.",
      priority: 5,
    },
    {
      start: "2025.06.03",
      end: "2025.07.03",
      title: "“Mane Bulletin” event is open.",
      priority: 6,
    },
    {
      start: "2025.06.05",
      end: "2025.06.19",
      title: "“Bette: The last film” event is open.",
      priority: 9,
    },
    {
      start: "2025.06.19",
      end: "2025.07.03",
      title: "Character banner “The Shattered Product” available.",
      priority: 7,
    },
    {
      start: "2025.06.19",
      end: null,
      title: "“The Answering Machine, The Butterfly and The Literaly Critic” is open.",
      priority: 4,
      },
    {
      start: "2025.06.20",
      end: "2025.07.03",
      title: "The rerun of event “Farewell, Rayashki” is open.",
      priority: 6,
    },
    {
      start: "2025.06.28",
      end: "2025.07.03",
      title: "Event “Labs Snapshots” is open.",
      priority: 3,
    },
    {
      start: "2025.06.19",
      end: "2025.07.03",
      title: "“Dialogues behind bars ||” is open.",
      priority: 8,
    },
  ];

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
  const pq = new PriorityQueue();
  events.forEach((event) => pq.enqueue(event, event.priority));
  const sortedEvents = pq.getAllSortedBy("highest");
  return (
    <section className="recent-updates">
      <div className="recent-updates">
        <h2>Recently Updated</h2>
        <div className="avatars">
          <img src={Picture1}/>
          <img src={Picture2}/>
          <img src= {Picture3}/>
        </div>

        <ul>
          {sortedEvents.map((event, index) => (
            <EventItem key={index} event={event}></EventItem>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EventList;