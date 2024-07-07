import { useState, useEffect } from "react";
import axios from "axios";
import MobileDetect from "mobile-detect";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../register.css";
import { useNavigate, Link } from "react-router-dom";
import {config} from "./config.js";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    birthdate: "",
    email: "",
    password: "",
    profileImage: [null]
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${config}/auth/register`, formData);
      console.log(response);
      localStorage.setItem('token', response.data.token);
      navigate("/")
      // Call the provided onRegisterSuccess callback if available
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage("Nombre de usuario y/o correo electronico en uso.");
    }
  };

  function redirectToMobileVersion() {
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile() !== null; // Check if it's a mobile device
    const mobileURL = "/registermovil";
    if (isMobile) {
      window.location.href = mobileURL;
    }
  }
  window.onload = redirectToMobileVersion;
  
    return (
      <Form onSubmit={handleSubmit} className="registerForm">
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" className="form-control" onChange={(event) => setFormData({...formData, name: event.target.value})} required/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control className="form-control" onChange={(event) => setFormData({...formData, lastname: event.target.value})} required/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control className="form-control" onChange={(event) => setFormData({...formData, username: event.target.value})} required/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control className="form-control" type="date" onChange={(event) => setFormData({...formData, birthdate: event.target.value})} required/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label for="exampleInputEmail1">Correo Electrónico</Form.Label>
          <Form.Control
            className="form-control"
            type="email"
            placeholder="name@example.com"
            onChange={(event) => setFormData({...formData, email: event.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label for="exampleInputPassword1">Contraseña</Form.Label>
          <Form.Control className="form-control" type="password" onChange={(event) => setFormData({...formData, password: event.target.value})} required/>
        </Form.Group>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn btn-primary">
            Registrarse
        </button>
        <Link type="button" className="btn btn-secondary" to={"/login"}>
            Volver
        </Link>
      </Form>
    );
  }