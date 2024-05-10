import { Form } from "react-bootstrap";
import LeafletgeoSearch from "./GeoSearch.js";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useRef } from "react";
import GetMapCenter from "./getMapCenter.js";

export function RegisterForm() {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" className="form-control" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control className="form-control" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control className="form-control" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Fecha de nacimiento</Form.Label>
        <Form.Control className="form-control" type="date" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label for="exampleInputEmail1">Correo Electrónico</Form.Label>
        <Form.Control
          className="form-control"
          type="email"
          placeholder="name@example.com"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label for="exampleInputPassword1">Contraseña</Form.Label>
        <Form.Control className="form-control" type="password" />
      </Form.Group>
    </Form>
  );
}

export function LoginForm() {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          controlId="email"
          autoFocus
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" />
      </Form.Group>
    </Form>
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
