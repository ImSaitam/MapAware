import { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../register.css";


export default function RegisterForm({ onClose, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    birthdate: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log(response);

      // Call the provided onRegisterSuccess callback if available
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        // Default behavior: redirect to login (implementation depends on your app)
        console.log("Redirecting to login (implementation needed)");
      }
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };
  
    return (
      <Form onSubmit={handleSubmit} className="registerForm">
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" className="form-control" onChange={(event) => setFormData({...formData, name: event.target.value})} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control className="form-control" onChange={(event) => setFormData({...formData, lastname: event.target.value})} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control className="form-control" onChange={(event) => setFormData({...formData, username: event.target.value})} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control className="form-control" type="date" onChange={(event) => setFormData({...formData, birthdate: event.target.value})} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label for="exampleInputEmail1">Correo Electrónico</Form.Label>
          <Form.Control
            className="form-control"
            type="email"
            placeholder="name@example.com"
            onChange={(event) => setFormData({...formData, email: event.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label for="exampleInputPassword1">Contraseña</Form.Label>
          <Form.Control className="form-control" type="password" onChange={(event) => setFormData({...formData, password: event.target.value})} />
        </Form.Group>
        <button type="submit" className="btn btn-primary">
            Registrarse
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
            Volver
        </button>
      </Form>
    );
  }