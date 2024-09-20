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
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setError("");
    setForm(initialState);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatBangladeshiPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // Check if it's a valid Bangladeshi number (should be 11 digits starting with '01')
    if (digitsOnly.length === 11 && digitsOnly.startsWith('01')) {
      return '+880' + digitsOnly.slice(1);
    }
    
    return phoneNumber;
  };

  const validateForm = () => {
    if (isSignUp) {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
      if (!/^01\d{9}$/.test(form.phoneNumber)) {
        setError("Please enter a valid Bangladeshi phone number (e.g., 01712345678)");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    const { fullName, userName, password, phoneNumber, avatarURL } = form;
    const URL = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    setIsLoading(true);

    try {
      const formattedPhoneNumber = formatBangladeshiPhoneNumber(phoneNumber);
      const response = await axios.post(URL, {
        userName,
        password,
        fullName: form.fullName,
        phoneNumber: formattedPhoneNumber,
        avatarURL,
      });

      const { token, userId, hashedPassword } = response.data;

      cookies.set("token", token);
      cookies.set("userName", userName);
      cookies.set("fullName", fullName);
      cookies.set("userId", userId);

      if (isSignUp) {
        cookies.set("hashedPassword", hashedPassword);
        cookies.set("phoneNumber", formattedPhoneNumber);
        cookies.set("avatarURL", avatarURL);
      }
      onAuth();
    } catch (error) {
      console.error("Authentication error:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  value={form.fullName}
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
                value={form.userName}
                required
              />
            </div>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone Number (e.g., 01712345678)"
                  onChange={handleChange}
                  value={form.phoneNumber}
                  required
                />
              </div>
            )}
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="url"
                  placeholder="Avatar URL"
                  onChange={handleChange}
                  value={form.avatarURL}
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
                value={form.password}
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
                  value={form.confirmPassword}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
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