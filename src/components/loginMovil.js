import { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../loginMovil.css";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../images/mapaware-logo.png";
import {config} from "./config.js";

export function LoginFormMovil() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${config}/auth/login`,
        formData
      );
      console.log(response.data);
      alert("Login successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      if (
        error.response.data.code === 401 ||
        error.response.data.message.includes("password")
      ) {
        setErrorMessage("Contraseña incorrecta. Intente nuevamente.");
      } else {
        alert(error.response.data?.message || "Login failed");
      }
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </Form>
    </div>
  );
}
