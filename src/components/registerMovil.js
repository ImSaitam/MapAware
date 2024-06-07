import { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import config from "./config.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../registerMovil.css";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../images/mapaware-logo.png";

export default function RegisterMovil() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    birthdate: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1); // Track form steps
  const navigate = useNavigate();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${config.Url}/auth/register`, formData);
      console.log(response);
      localStorage.setItem('token', response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <Form onSubmit={handleSubmit} className="register-movil-container">
      <Link to={"/loginMovil"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z" />
          <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z" />
        </svg>
      </Link>

      <img src={logoImage} alt="Logo" className="logo-img" />
      <h2 className="form-heading">Registro</h2>
      {step === 1 && (
        <>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Nombre</Form.Label>
            <Form.Control type="text" className="form-control-input" name="name" onChange={handleFormChange} required />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Apellido</Form.Label>
            <Form.Control className="form-control-input" name="lastname" onChange={handleFormChange} required />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Nombre de usuario</Form.Label>
            <Form.Control className="form-control-input" name="username" onChange={handleFormChange} required />
          </Form.Group>
          <button type="button" className="btn btn-secondary" onClick={handleNextStep}>
            Siguiente
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Fecha de nacimiento</Form.Label>
            <Form.Control className="form-control-input" type="date" name="birthdate" onChange={handleFormChange} required />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Correo Electrónico</Form.Label>
            <Form.Control className="form-control-input" type="email" placeholder="name@example.com" name="email" onChange={handleFormChange} required />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Contraseña</Form.Label>
            <Form.Control className="form-control-input" type="password" name="password" onChange={handleFormChange} required />
          </Form.Group>
          <button type="button" className="btn btn-secondary mr-2" onClick={handlePrevStep}>
            Volver
          </button>
          <button type="submit" className="btn-register btn btn-primary">
            Registrarse
          </button>
        </>
      )}
    </Form>
  );
}
