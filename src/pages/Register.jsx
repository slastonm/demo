import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 2) {
      return setError("Username must be 2 or more characters");
    }
    if (!email.includes("@")) {
      return setError("Invalid email");
    }
    if (password.length < 6) {
      return setError(setError("password must be 6 or more characters"));
    }
    // login(username);
    // navigate("/");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );
      if (response.status === 201) {
        navigate("/login");
      } else {
        const msg = await response.text();
        setError(`Registration failed: ${msg}`);
      }
    } catch (err) {}
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div id="authContainer">
          <input
            value={username}
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <input
            value={email}
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <br />
          <br />
          <input
            value={password}
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button type="submit">Register</button>
        </div>
      </form>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", fontSize: "25px" }}>
          {error}
        </p>
      )}
    </>
  );
}

export default Register;
