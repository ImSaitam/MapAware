import { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../register.css";
import { useNavigate, Link } from "react-router-dom";

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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirect to login if no token
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log(response);
      localStorage.setItem('token', response.data.token);
      navigate("/")
      // Call the provided onRegisterSuccess callback if available
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };
  function redirectToMobileVersion() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|opera mini|windows mobile|palm|iemobile|symbian/i.test(userAgent);
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
        <button type="submit" className="btn btn-primary">
            Registrarse
        </button>
        <Link type="button" className="btn btn-secondary" to={"/login"}>
            Volver
        </Link>
      </Form>
    );
  }