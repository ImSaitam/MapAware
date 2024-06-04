import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
  Marker,
} from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";

function GetMapCenter({ setCenter }) {
  const map = useMap();
  const [center, setMapCenter] = useState(map.getCenter());

  const centerMapIcon = new Icon({
    iconUrl:
      "https://static-00.iconduck.com/assets.00/map-marker-icon-342x512-gd1hf1rz.png",
    iconSize: [19, 28],
  });

  const updateCenter = () => {
    const newCenter = map.getCenter();
    setMapCenter(newCenter);
    setCenter(newCenter);
  };

  map.on("moveend", updateCenter);

  return (
    center && (
      <Marker position={[center.lat, center.lng]} icon={centerMapIcon} />
    )
  );
}

export function AddIncident({ onEventAdded, setShowIncidentModal }) {
  const mapRef = useRef();
  const [center, setCenter] = useState([0, 0]);

  const [event, setEvent] = useState({
    category: "",
    degree: 3,
    description: "",
    latitude: null,
    longitude: null,
  });

  const bounds = [
    [86, -190], // Suroeste (SW)
    [-86, 230], // Noreste (NE)
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting event:", event); // Debug log

    try {
      const response = await axios.post("http://localhost:8080/event", event, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Incident added:", response.data);
      onEventAdded(); // Llama la función callback después de añadir un evento
    } catch (error) {
      console.error("There was an error adding the incident!", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        mapRef.current.setView([latitude, longitude], 15); // Zoom al lugar de la ubicación actual
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
      }
    );
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>
          ¿Qué clase de incidente ocurrió en esa ubicación?
        </Form.Label>
        <Form.Control
          as="select"
          value={event.category}
          onChange={(e) => setEvent({ ...event, category: e.target.value })}
          required
        >
          <option disabled value="">
            Tipo de incidente...
          </option>
          <option value="Accidente">Accidente</option>
          <option value="Asalto">Asalto</option>
          <option value="Manifestación">Manifestación</option>
          <option value="Obras">Obras</option>
          <option value="Piquete">Piquete</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Gravedad</Form.Label>
        <Form.Range
          min={1}
          max={5}
          value={event.degree}
          onChange={(e) => setEvent({ ...event, degree: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Añade una breve descripción del incidente.</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ingrese la ubicación del incidente:</Form.Label>
        <MapContainer
          id="mapIncident"
          center={center}
          zoom={16}
          ref={mapRef}
          zoomControl={false}
          maxBounds={bounds}
          minZoom={4}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GetMapCenter
            setCenter={(newCenter) =>
              setEvent({
                ...event,
                latitude: newCenter.lat,
                longitude: newCenter.lng,
              })
            }
          />
          <ZoomControl className="zoomControl" position="bottomright" />
        </MapContainer>
      </Form.Group>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => setShowIncidentModal(false)}
      >
        Añadir Incidente
      </button>
    </Form>
  );
}
