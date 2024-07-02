import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../loginMovil.css";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../images/mapaware-logo.png";
import {config} from "./config.js";

export function LoginFormMovil() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    error: false,
  });

  const [variant, setVariant] = useState("");
  const [message, setMessage] = useState(""); // Agregamos un estado para el mensaje de éxito
  const [showAlert, setShowAlert] = useState(false); // Agregamos un estado para mostrar el alert de éxito
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${config}/auth/login`,
        formData
      );
      localStorage.setItem('token', response.data.token);
      setVariant("success");
      setMessage("¡Inicio de sesión exitoso! Redirigiendo a MapAware."); // Establecemos el mensaje de éxito
      setShowAlert(true); // Mostramos el alert de éxito
      setTimeout(() => {
        navigate("/"); // Redirigimos al usuario después de 2 segundos
      }, 2000);
    } catch (error) {
        setShowAlert(true);
        setVariant("danger");
        setMessage("Nombre de usuario y/o contraseña incorrecta. Intente nuevamente.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    <div className="centerForm-movil">
      <div className="headerForm-movil">
        <img src={logoImage} alt="Logo" className="logo-login-img" />
        <h2 className="form-heading-login">Inicio de sesión</h2>
      </div>
      <Form onSubmit={handleSubmit} className="loginForm-movil">
        <Form.Group className="mb-3">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            autoFocus
            value={formData.username}
            onChange={(event) =>
              setFormData({ ...formData, username: event.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({ ...formData, password: event.target.value })
            }
            required
          />
          {showAlert && (
          <Alert variant={variant} className="alertMessage" onClose={() => setShowAlert(false)}>
            {message}
          </Alert>
        )}
        </Form.Group>
        <button type="submit" className="btn new-btn-primary">
          Iniciar sesión
        </button>
        <Link
          type="submit"
          className="btn new-btn-secondary"
          to={"/registerMovil"}
        >
          Registrarse
        </Link>
      </Form>
    </div>
  );
}
