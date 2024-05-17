import { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterForm from "./register.js"; // Import RegisterForm component
import "../login.css";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    setIsRegisterFormOpen(false);
    alert("Registro exitoso! Inicie sesión ahora.");
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8080/auth/login",
      formData
    );
    console.log(response.data);
    alert("Login successful!");
    localStorage.setItem('token', response.data.token);
    navigate("/")
  } catch (error) {
    console.error(error.response.data);
    if (error.response.data.code === 401 || error.response.data.message.includes("password")) {
      setErrorMessage("Contraseña incorrecta. Intente nuevamente.");
    } else {
      alert(error.response.data?.message || "Login failed");
    }
  }
};

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/'); // Redirect to login if no token
  }
}, [navigate]);

  const handleOpenRegisterForm = () => {
    setIsRegisterFormOpen(true);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  }

  return (
    <div className="centerForm">
      {isRegisterFormOpen ? (
        <RegisterForm onClose={() => setIsRegisterFormOpen(false)} onRegisterSuccess={handleRegisterSuccess} />
      ) : (
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
            />
         </Form.Group>
          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>
          <Link type="submit" className="btn btn-secondary" to={"/register"}>
            Registrarse
          </Link>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </Form>
      )}
    </div>
  );
}