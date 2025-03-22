import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({username: "",email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post("http://localhost:3000/api/auth/signup", formData);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    
    <div className="signup-container">
      <h3 style={{fontWeight:'500', fontSize:'25px'}}>Register</h3>
      <form onSubmit={handleSubmit}>
        <input className="signup-input" type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="signup-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="signup-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="signup-button" type="submit">Done</button>
        <h3 className="login-sug">Already have an account? <Link to='/login'> Login </Link> </h3>
      </form>
    </div> 
  );
}

export default Signup;
