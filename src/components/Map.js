import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import "../Map.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet-geosearch/dist/geosearch.css";
import LeafletgeoSearch from "./GeoSearch.js";
import { AddIncident } from "./forms.js";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Dropdown, ButtonGroup, Form } from "react-bootstrap";
import markerAccidente from "../images/marker-accidente.svg";
import markerObras from "../images/marker-obra.svg";
import markerManifestacion from "../images/marker-manifestacion.svg";
import markerAsalto from "../images/marker-asalto.svg";
import markerPiquete from "../images/marker-piquete.svg";

// Función del Mapa
export default function Map() {
  // Estado para la ubicación actual
  const [position, setPosition] = useState(null);
  // Estado para controlar la visibilidad del modal de subida de incidente
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  // Estado para eventos
  const [events, setEvents] = useState([]);
  // Estado para mostrar la vista previa de la subida de imagen
  const mapRef = useRef();

  const navigate = useNavigate();

  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: 'Accidente', checked: true },
    { id: 2, label: 'Obras', checked: true },
    { id: 3, label: 'Manifestación', checked: true },
    { id: 4, label: 'Asalto', checked: true },
    { id: 5, label: 'Piquete', checked: true },
  ]);

  const handleCheckboxChange = (id) => {
    setCheckboxes(
      checkboxes.map((checkbox) => {
        if (checkbox.id === id) {
          return {...checkbox, checked:!checkbox.checked };
        }
        return checkbox;
      })
    );
  };

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || token === undefined) {
      navigate("/login"); // Redirect to login if no token
    }
  
    try {
      const response = await axios.get("http://localhost:8080/event/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response:", response.data); // Debug log for API response
      if (Array.isArray(response.data)) {
        const filteredEvents = response.data.filter((event) => {
          const checkbox = checkboxes.find((c) => c.label === event.category);
          return checkbox && checkbox.checked;
        });
        setEvents(filteredEvents);
      } else {
        console.error("Expected an array of events, but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired, redirect to login
        navigate("/login");
      }
    }
  }, [navigate, checkboxes]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, checkboxes]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Icono para los marcadores
  const incidentIcons = {
    Accidente: {
      iconUrl: markerAccidente,
      iconSize: [36, 36],
    },
    Obras: {
      iconUrl: markerObras,
      iconSize: [36, 36],
    },
    Manifestación: {
      iconUrl: markerManifestacion,
      iconSize: [36, 36],
    },
    Asalto: {
      iconUrl: markerAsalto,
      iconSize: [36, 36],
    },
    Piquete: {
      iconUrl: markerPiquete,
      iconSize: [36, 36],
    },
  };

  const bounds = [
    [86, -170], // Suroeste (SW)
    [-86, 190], // Noreste (NE)
  ];

  // Icono para la ubicación actual
  const CurrentLocationIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/106/106438.png",
    iconSize: [19, 19],
  });

  // Componente LocateMarker con setPosition como prop
  function LocateMarker({ position }) {
    return position ? (
      <Marker position={position} icon={CurrentLocationIcon}>
        <Popup>Ubicación Actual</Popup>
      </Marker>
    ) : null;
  }

  // Función para manejar la ubicación actual
  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        mapRef.current.flyTo(
          [position.coords.latitude, position.coords.longitude],
          15
        ); // Zoom al lugar de la ubicación actual
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
      }
    );
  };

  return (
    <div className="map-container">
      {/* Botón para ubicación actual */}
      <button onClick={handleLocate} className="locate-button">
        <img
          src="https://cdn-icons-png.flaticon.com/512/60/60523.png"
          className="location-icon"
          alt=""
        ></img>
      </button>
      {/* Botón para abrir el modal */}
      <Link
        style={{
          position: "absolute",
          top: "10px",
          backgroundColor: "transparent",
          borderStyle: "none",
          right: "5px",
          zIndex: 1000,
        }}
        to={"/profile"}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
          className="user-icon"
          alt=""
        ></img>
      </Link>

      <button className="button-add" onClick={() => setShowIncidentModal(true)}>
        <img
          src="https://pixsector.com/cache/c5433603/av741f3e5fd1c88304cf8.png"
          className="add-icon"
          alt=""
        ></img>
      </button>
      {/* Modal */}
      <Modal
        show={showIncidentModal}
        onHide={() => setShowIncidentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir un incidente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddIncident
            onEventAdded={fetchEvents}
            setShowIncidentModal={setShowIncidentModal}
          />
        </Modal.Body>
      </Modal>
      <div className="dropupFilter">
        <Dropdown drop="up" as={ButtonGroup}>
        <Dropdown.Toggle variant="success">
          Filtros
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {checkboxes.map((checkbox) => (
  <Form.Check
    key={checkbox.id}
    type="checkbox"
    className="eventType"
    id={`checkbox-${checkbox.id}`}
    label={checkbox.label}
    checked={checkbox.checked}
    onChange={() => handleCheckboxChange(checkbox.id)}
  />
))}
        </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[-34.603851, -58.381775]}
        zoom={13}
        ref={mapRef}
        zoomControl={false}
        minZoom={5}
        maxBounds={bounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marcadores de eventos */}
        {Array.isArray(events) &&
          events.map((event, index) => (
            <Marker
              key={index}
              position={[event.latitude, event.longitude]}
              icon={new Icon(incidentIcons[event.category])}
            >
              <Popup>
                <p>
                  Añadido por{" "}
                  <Link to={`/user/${event.user.username}`}>
                    {event.user.username}
                  </Link>
                </p>
                <h3>{event.category}</h3>
                <p>{event.description}</p>
                <p>Gravedad: {event.degree}</p>
              </Popup>
            </Marker>
          ))}
        {/* Marcador para la ubicación actual */}
        <LocateMarker position={position} />
        <ZoomControl className="zoomControl" position="topleft" />
        <LeafletgeoSearch />
      </MapContainer>
    </div>
  );
}
