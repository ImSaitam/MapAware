import { Form } from "react-bootstrap";
import LeafletgeoSearch from "./GeoSearch.js";
import { MapContainer, TileLayer, ZoomControl, useMap, Marker } from "react-leaflet";
import { useRef, useState } from "react";
import { Icon } from "leaflet";
import axios from 'axios';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    birthdate: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted!');
    console.log(formData);

    axios.post('http://localhost:8080/auth/register', formData)
     .then(response => {
        console.log(response);
        alert('Registro exitoso!');
      })
     .catch(error => {
        console.error(error);
        alert('Error al registrar');
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" className="form-control" onChange={(event) => setFormData({...formData, name: event.target.value})} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control className="form-control" onChange={(event) => setFormData({...formData, lastName: event.target.value})} />
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
      <button type="submit" className="btn btn-primary">Registrarse</button>
    </Form>
  );
}

export function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      console.log(response.data);

      alert('Login successful!');

    } catch (error) {
      console.error(error.response.data);
      setErrorMessage(error.response.data.message || 'Login failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre de Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="username"
          controlId="username"
          autoFocus
          value={formData.username}
          onChange={(event) => setFormData({ ...formData, username: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
      </Form.Group>
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
    </Form>
  );
}

function GetMapCenter() {
    const map = useMap();
    const [center, setCenter] = useState(null);
    const newCenter = map.getCenter();
  
    const centerMapIcon = new Icon({
      iconUrl:
        "https://static-00.iconduck.com/assets.00/map-marker-icon-342x512-gd1hf1rz.png",
      iconSize: [19, 28],
    });
  
    const updateCenter = () => {
      setCenter(newCenter);
    };
    map.on("move", updateCenter);
  
    return (
      center && (
        <Marker position={[center.lat, center.lng]} icon={centerMapIcon} />
      )
    );
  }

export function AddIncident() {
  const mapRef = useRef();
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Añade un titulo al incidente:</Form.Label>
        <Form.Control
          type="text"
          controlId="titleIncident"
          placeholder="Ej: Choque triple de automóviles"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          ¿Que clase de incidente ocurrio en esa ubicación?
        </Form.Label>
        <select className="form-select form-select-sm">
          {/* Agregar mas tipos de incidentes!!! */}
          <option disabled selected>
            Tipo de incidente...
          </option>
          <option value={1}>Accidente</option>
          <option value={2}>Asalto</option>
          <option value={3}>Manifestación</option>
          <option value={4}>Obras</option>
          <option value={5}>Paro</option>
          <option value={6}>Piquete</option>
        </select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Añade una breve descripción del incidente.</Form.Label>
        <textarea
          className="form-control"
          controlId="descriptionIncident"
          rows={3}
        ></textarea>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ingrese la ubicación del incidente:</Form.Label>
        <MapContainer
          id="mapIncident"
          center={[-34.603851, -58.381775]}
          zoom={16}
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GetMapCenter />
          <ZoomControl className="zoomControl" position="bottomright" />
          <LeafletgeoSearch />
        </MapContainer>
      </Form.Group>
    </Form>
  );
}