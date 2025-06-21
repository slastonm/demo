import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        return setError(msg || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      login(data.user.username, data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again");
    }
  };
  return (
    <>
      <h2>Login page/ Register</h2>
      <form onSubmit={handleSubmit}>
        <div id="authContainer">
          <input
            value={email}
            type="email"
            id="Email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit">Login</button>
          <br />
          <br />

          <div className="register-block">
            Don't have account? <Link to="/register">Register here</Link>
          </div>
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

export default Login;
