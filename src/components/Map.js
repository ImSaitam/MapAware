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

export default function Map() {
  const [position, setPosition] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [events, setEvents] = useState([]);
  const mapRef = useRef();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "Accidente", checked: true },
    { id: 2, label: "Obras", checked: true },
    { id: 3, label: "Manifestación", checked: true },
    { id: 4, label: "Asalto", checked: true },
    { id: 5, label: "Piquete", checked: true },
  ]);

  const handleCheckboxChange = (id) => {
    setCheckboxes(
      checkboxes.map((checkbox) => {
        if (checkbox.id === id) {
          return { ...checkbox, checked: !checkbox.checked };
        }
        return checkbox;
      })
    );
  };

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || token === undefined) {
      navigate("/login");
    }

    try {
      const selectedCategories = checkboxes
        .filter((checkbox) => checkbox.checked)
        .map(
          (checkbox) =>
            `cat=${encodeURIComponent(checkbox.label.toLowerCase())}`
        )
        .join("&");

      const url = `http://localhost:8080/event/filtered?${selectedCategories}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response:", response.data);
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error("Expected an array of events, but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  }, [navigate, checkboxes]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, checkboxes]);

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
    [86, -170],
    [-86, 190],
  ];

  function LocateMarker({ position }) {
    return position;
  }

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        mapRef.current.flyTo(
          [position.coords.latitude, position.coords.longitude],
          15
        );
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
      }
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="map-container">
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
      <div className={`buttons-container ${isDropdownOpen ? "moved-up" : ""}`}>
        <button onClick={handleLocate} className="locate-button">
          <img
            src="https://cdn-icons-png.flaticon.com/512/60/60523.png"
            className="location-icon"
            alt=""
          ></img>
        </button>
        <button
          className="button-add"
          onClick={() => setShowIncidentModal(true)}
        >
          <img
            src="https://pixsector.com/cache/c5433603/av741f3e5fd1c88304cf8.png"
            className="add-icon"
            alt=""
          ></img>
        </button>
      </div>
      <div className="dropupFilter">
        <Dropdown drop="up" as={ButtonGroup} show={isDropdownOpen}>
          <Dropdown.Toggle variant="success" onClick={toggleDropdown}>
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
      <MapContainer
        center={[-34.603851, -58.381775]}
        zoom={13}
        ref={mapRef}
        zoomControl={false}
        minZoom={4}
        maxBounds={bounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
        <LocateMarker position={position} />
        <ZoomControl className="zoomControl" position="topleft" />
        <LeafletgeoSearch className="leaflet-geosearch" />
      </MapContainer>
    </div>
  );
}
