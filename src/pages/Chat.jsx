import React, { useState, useEffect, useRef } from "react";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [stats, setStats] = useState(null);

  // Form states
  const [username, setUsername] = useState("TestUser");
  const [userMessage, setUserMessage] = useState("");
  const [alertLevel, setAlertLevel] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const eventSourceRef = useRef(null);
  const SERVER_URL = import.meta.env.VITE_API_URL;

  const connectToStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(
      `${SERVER_URL}/communication/stream`
    );

    eventSourceRef.current.onopen = () => {
      setConnectionStatus("connected");
      console.log("Connected to event stream");
    };

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    eventSourceRef.current.onerror = (error) => {
      setConnectionStatus("error");
      console.error("EventSource failed:", error);
    };
  };

  const disconnectFromStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnectionStatus("disconnected");
    }
  };

  const sendUserMessage = async () => {
    if (!userMessage) return;

    try {
      const response = await fetch(`${SERVER_URL}/communication/send/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          username,
          userId: "user_" + Date.now(),
        }),
      });

      if (response.ok) {
        setUserMessage("");
      }
    } catch (error) {
      console.error("Error sending user message:", error);
    }
  };

  const sendSystemAlert = async () => {
    if (!alertMessage) return;

    try {
      await fetch(`${SERVER_URL}/communication/send/alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: alertMessage,
          level: alertLevel,
          source: "react-test",
        }),
      });

      setAlertMessage("");
    } catch (error) {
      console.error("Error sending system alert:", error);
    }
  };

  const sendNotification = async () => {
    if (!notificationTitle || !notificationMessage) return;

    try {
      await fetch(`${SERVER_URL}/communication/send/notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notificationTitle,
          message: notificationMessage,
          userId: "react_user",
        }),
      });

      setNotificationTitle("");
      setNotificationMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastMessage) return;

    try {
      await fetch(`${SERVER_URL}/communication/send/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle || "Broadcast",
          message: broadcastMessage,
          priority: "normal",
        }),
      });

      setBroadcastTitle("");
      setBroadcastMessage("");
    } catch (error) {
      console.error("Error sending broadcast:", error);
    }
  };

  const sendTestMessage = async () => {
    try {
      await fetch(`${SERVER_URL}/communication/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error sending test message:", error);
    }
  };

  const getStats = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/communication/stats`);
      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error("Error getting stats:", error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "green";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  const getMessageStyle = (type) => {
    const baseStyle = {
      padding: "8px",
      margin: "4px 0",
      borderLeft: "4px solid",
    };
    switch (type) {
      case "userMessage":
        return {
          ...baseStyle,
          borderLeftColor: "green",
          backgroundColor: "#e8f5e8",
        };
      case "systemAlert":
        return {
          ...baseStyle,
          borderLeftColor: "orange",
          backgroundColor: "#fff3cd",
        };
      case "notification":
        return {
          ...baseStyle,
          borderLeftColor: "blue",
          backgroundColor: "#e6f3ff",
        };
      case "broadcast":
        return {
          ...baseStyle,
          borderLeftColor: "red",
          backgroundColor: "#ffe6e6",
        };
      default:
        return {
          ...baseStyle,
          borderLeftColor: "gray",
          backgroundColor: "#f5f5f5",
        };
    }
  };

  const formatMessage = (msg) => {
    switch (msg.type) {
      case "userMessage":
        return `${msg.username}: ${msg.message}`;
      case "systemAlert":
        return `[${msg.level?.toUpperCase()}] ${msg.message}`;
      case "notification":
        return `${msg.title}: ${msg.message}`;
      case "broadcast":
        return `[BROADCAST] ${msg.title}: ${msg.message}`;
      case "connection":
        return `[SYSTEM] ${msg.message}`;
      default:
        return JSON.stringify(msg);
    }
  };

  useEffect(() => {
    connectToStream();
    return () => {
      disconnectFromStream();
    };
  }, []);
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Reactive Communication Test</h1>

      {/* Connection Status */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor:
            getStatusColor() === "green"
              ? "#d4edda"
              : getStatusColor() === "red"
              ? "#f8d7da"
              : "#e9ecef",
          color:
            getStatusColor() === "green"
              ? "#155724"
              : getStatusColor() === "red"
              ? "#721c24"
              : "#495057",
        }}
      >
        Status:{" "}
        {connectionStatus === "connected"
          ? "🟢 Connected"
          : connectionStatus === "error"
          ? "🔴 Error"
          : "⚫ Disconnected"}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Messages Panel */}
        <div>
          <h3>📨 Real-time Messages</h3>
          <div style={{ marginBottom: "10px" }}>
            <button onClick={connectToStream} style={{ marginRight: "10px" }}>
              Connect
            </button>
            <button
              onClick={disconnectFromStream}
              style={{ marginRight: "10px" }}
            >
              Disconnect
            </button>
            <button onClick={clearMessages} style={{ marginRight: "10px" }}>
              Clear
            </button>
            <button onClick={getStats}>Get Stats</button>
          </div>

          {stats && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                marginBottom: "10px",
              }}
            >
              <strong>Stats:</strong> {stats.activeConnections} connections,{" "}
              {stats.totalListeners} listeners
            </div>
          )}

          <div
            style={{
              height: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
              backgroundColor: "#fafafa",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={getMessageStyle(msg.type)}>
                <div>{formatMessage(msg)}</div>
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Send Messages Panel */}
        <div>
          <h3>📤 Send Messages</h3>

          {/* User Message */}
          <div style={{ marginBottom: "20px" }}>
            <h4>User Message</h4>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="Your message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={sendUserMessage}>Send</button>
          </div>

          {/* System Alert */}
          <div style={{ marginBottom: "20px" }}>
            <h4>System Alert</h4>
            <select
              value={alertLevel}
              onChange={(e) => setAlertLevel(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            <input
              type="text"
              placeholder="Alert message"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={sendSystemAlert}>Send Alert</button>
          </div>

          {/* Notification */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Notification</h4>
            <input
              type="text"
              placeholder="Title"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="Message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={sendNotification}>Send Notification</button>
          </div>

          {/* Broadcast */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Broadcast</h4>
            <input
              type="text"
              placeholder="Title"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              style={{
                marginRight: "10px",
                padding: "5px",
                display: "block",
                marginBottom: "5px",
              }}
            />
            <textarea
              placeholder="Broadcast message"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              style={{
                marginRight: "10px",
                padding: "5px",
                display: "block",
                marginBottom: "5px",
                width: "200px",
              }}
            />
            <button onClick={sendBroadcast}>Send Broadcast</button>
          </div>

          {/* Test */}
          <div>
            <h4>Test</h4>
            <button onClick={sendTestMessage} style={{ marginRight: "10px" }}>
              Send Random Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
