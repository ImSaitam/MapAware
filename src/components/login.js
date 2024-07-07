import { useState, useEffect } from "react";
import MobileDetect from "mobile-detect";
import axios from "axios";
import { Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../login.css";
import { Link, useNavigate } from "react-router-dom";
import {config} from "./config.js";

export function LoginForm() {
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
    const token = localStorage.getItem('token');
    if (token || !token === undefined) {
      navigate('/');
    }
  }, [navigate]);

  function redirectToMobileVersion() {
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile() !== null; // Check if it's a mobile device
    const mobileURL = "/loginMovil";
    if (isMobile) {
      window.location.href = mobileURL;
    }
  }
  window.onload = redirectToMobileVersion;

  return (
    <div className="centerForm">
      <Form onSubmit={handleSubmit} className="loginForm">
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
            style={formData.error? { borderColor: 'red'} : {}}
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
            style={formData.error? { borderColor: 'red'} : {}}
          />
          {/*<Link variant="link" className="forgotPswrdButton" to={"/"}>
            Olvidaste tu contraseña?
          </Link>*/}
        </Form.Group>
        {showAlert && (
          <Alert variant={variant} onClose={() => setShowAlert(false)}>
            {message}
          </Alert>
        )}
        <button type="submit" className="btn btn-primary">
          Iniciar sesión
        </button>
        <Link type="submit" className="btn btn-secondary" to={"/register"}>
          Registrarse
        </Link>
      </Form>
    </div>
  );
}