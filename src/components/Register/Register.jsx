'use client'
import { useState } from "react";
import { http } from '@/services/http'

export default function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await http.post("/register", {
          username,
          email,
          password,
        });
        console.log('11')
        alert("Registration successful!");
        window.location.href = "/"; // Redirect to login page
      } catch (error) {
        console.log('ERROR')
        setError(error.response?.data?.message || "An error occurred");
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
}
