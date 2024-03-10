"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check credentials here (e.g., compare with stored credentials)
    if (email === "admin" && password === "admin") {
      // Successful login
      // Redirect to dashboard or any other page
      localStorage.setItem("authToken", true);
      router.push("/");
    } else {
      // Invalid credentials
      setError("Invalid email or password");
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form className="card card-body login-form" onSubmit={handleSubmit}>
              <h2 className="text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group mb-4">
                <label htmlFor="email">Username</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default login;
