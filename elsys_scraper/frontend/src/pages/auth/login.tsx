import React, { useState } from 'react';
import axios from 'axios';
import {api, api_response} from "~/utils/types"
const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend API for login
      const response : api_response = await axios({
        method     });

      if (response.status === 200) {
        // Login successful, handle success scenario
        // For example, set authentication token in local storage, redirect, etc.
        console.log('Login successful:', response.data);
      } else {
        // Login failed, handle failure scenario
        // For example, display an error message to the user
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      // Handle errors that occur during the login process
      console.error('Error during login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
