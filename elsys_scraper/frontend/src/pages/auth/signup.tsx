import React, { useState } from 'react';
import axios from 'axios';
import {api_response} from '~/utils/types'
interface SignupFormData {
  email: string;
  password: string;
  // Add more fields as needed for signup
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    // Initialize other form fields here
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend API endpoint
      const response: api_response = await axios.post('', formData);

      if (response.status === 200) {
        // Signup successful, handle success scenario
        // For example, redirect to a success page or display a success message
        console.log('Signup successful:', response.data);
      } else {
        // Signup failed, handle failure scenario
        // For example, display an error message to the user
        console.error('Signup failed:', response.data);
      }
    } catch (error) {
      // Handle errors that occur during the signup process
      console.error('Error during signup:', error);
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
      {/* Add other form fields as needed */}

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
