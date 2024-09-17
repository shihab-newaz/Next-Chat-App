"use client";

import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import Image from "next/image";
import signInImage from "@/assets/sign-in.png";

const cookies = new Cookies();

const initialState = {
  fullName: "",
  userName: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  avatarURL: "",
};

const Auth = ({ onAuth }) => {
  const [form, setForm] = useState(initialState);
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { fullName, userName, password, phoneNumber, avatarURL } = form;
    const URL = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    try {
      const response = await axios.post(URL, {
        userName,
        password,
        fullName: form.fullName,
        phoneNumber,
        avatarURL,
      });

      const { token, userId, hashedPassword } = response.data;

      cookies.set("token", token);
      cookies.set("userName", userName);
      cookies.set("fullName", fullName);
      cookies.set("userId", userId);

      if (isSignUp) {
        cookies.set("hashedPassword", hashedPassword);
        cookies.set("phoneNumber", phoneNumber);
        cookies.set("avatarURL", avatarURL);
      }
      onAuth();
    } catch (error) {
      console.error("Authentication error:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "An unexpected error occurred");
    }
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignUp ? "Sign Up" : "Sign In"}</p>
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="userName">Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </div>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
              <button>{isSignUp ? "Sign Up" : "Sign In"}</button>
            </div>
          </form>
          {error && <p className="auth__form-container_fields-content_error">{error}</p>}
          <div className="auth__form-container_fields-account">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <span onClick={switchMode}>{isSignUp ? "Sign In" : "Sign Up"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <Image src={signInImage} alt="sign in" />
      </div>
    </div>
  );
};

export default Auth;