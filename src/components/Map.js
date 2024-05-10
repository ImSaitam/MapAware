import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../Map.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { ModalBody, ModalFooter } from "react-bootstrap";
import "leaflet-geosearch/dist/geosearch.css";
import LeafletgeoSearch from "./GeoSearch.js";
import { AddIncident, LoginForm, RegisterForm } from "./forms.js";

// Función del Mapa
function Map() {
  // Estado para la ubicación actual
  const [position, setPosition] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para controlar la visibilidad del modal de registro
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPswdModal, setShowForgotPswdModal] = useState(false);
  // Estado para controlar la visibilidad del modal de subida de incidente
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  // Estado para mostrar la vista previa de la subida de imagen
  const mapRef = useRef();

  // Icono para los marcadores
  const CustomIcons = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [19, 19],
  });

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

  // Vector con marcadores de ejemplo
  const markers = [
    {
      geocode: [-34.601085, -58.383186],
      popUp: "Teatro Colon",
      descripcion:
        "El Teatro Colón de Buenos Aires es una de las salas de ópera más importantes del mundo. Su rico y prestigioso historial y las excepcionales condiciones acústicas y arquitectónicas de su edificio lo colocan al nivel de teatros como la Scala de Milán, la Ópera de París, la Ópera de Viena, el Covent Garden de Londres y el Metropolitan de Nueva York.",
    },
    {
      geocode: [-34.603851, -58.381775],
      popUp: "Obelisco",
    },
    {
      geocode: [-34.607437, -58.365504],
      popUp: "Puente de la Mujer",
    },
    {
      geocode: [-34.510753457690186, -58.554239919318626],
      popUp: "Mesquita Mönchengladbach",
    },
  ];

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
      <Button
        style={{
          position: "absolute",
          top: "10px",
          backgroundColor: "transparent",
          borderStyle: "none",
          right: "5px",
          zIndex: 1000,
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
          className="user-icon"
          alt=""
        ></img>
      </Button>

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
          <AddIncident />
        </Modal.Body>
        <ModalFooter>
          <Button variant="primary">Subir incidente</Button>
        </ModalFooter>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inicia sesión en MapAware</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm />
        </Modal.Body>
        <Modal.Footer>
        <Button
              variant="link"
              className="forgotPswrd"
              onClick={() => {
                setShowModal(false);
                setShowForgotPswdModal(true);
              }}
            >
              Has olvidado tu contraseña?
            </Button>
            <Button
              variant="link"
              className="register-button"
              onClick={() => {
                setShowModal(false);
                setShowRegisterModal(true);
              }}
            >
              Registrate en MapAware
            </Button>
          <Button variant="primary">Iniciar sesión</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showForgotPswdModal}
        onHide={() => setShowForgotPswdModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Has olvidado tu contraseña?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Ingrese el correo electrónico de tu cuenta.
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                controlId="email"
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            id="backButton"
            onClick={() => {
              setShowModal(true);
              setShowForgotPswdModal(false);
            }}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              setShowForgotPswdModal(false);
            }}
          >
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrate en MapAware</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <RegisterForm />
        </ModalBody>
        <Modal.Footer>
          <Button
            variant="secondary"
            id="backButton"
            onClick={() => {
              setShowModal(true);
              setShowRegisterModal(false);
            }}
          >
            Volver
          </Button>
          <Button variant="primary">Registrarse</Button>
        </Modal.Footer>
      </Modal>

      {/* Mapa */}
      <MapContainer
        center={[-34.603851, -58.381775]}
        zoom={13}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marcadores */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={CustomIcons}>
            <Popup>
              <h3>{marker.popUp}</h3>
              <p>{marker.descripcion}</p>
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

export default Map;