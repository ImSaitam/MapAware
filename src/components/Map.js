import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";
import { Icon } from 'leaflet';
import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../Map.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

// Función del Mapa
function Map() {
  // Estado para la ubicación actual
  const [position, setPosition] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Referencia al mapa
  const mapRef = useRef();

  // Icono para la ubicación actual
  const CurrentLocationIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/106/106438.png",
    iconSize: [19, 19]
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
      popUp: "Teatro Colon"
    },
    {
      geocode: [-34.603851, -58.381775],
      popUp: "Obelisco"
    },
    {
      geocode: [-34.607437, -58.365504],
      popUp: "Puente de la Mujer"
    }
  ];

  // Icono para los marcadores
  const CustomIcons = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [19, 19]
  });

  return (
    <div className="map-container">
      {/* Botón para ubicación actual */}
      <button onClick={handleLocate} className="locate-button">
        <img
          src="https://cdn-icons-png.flaticon.com/512/60/60523.png"
          className="location-icon"
        ></img>
      </button>
      {/* Botón para abrir el modal */}
      <Button style={{ 
                        position: 'absolute',
                        top: '10px',
                        backgroundColor: 'transparent',
                        borderStyle: 'none',
                        right: '5px',
                        zIndex: 1000
                  }}  
     onClick={() => setShowModal(true)}>
        <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" className="user-icon"></img>
      </Button>

      <button className="button-add">
        <img src="https://pixsector.com/cache/c5433603/av741f3e5fd1c88304cf8.png" className="add-icon">
        </img>
      </button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inicia sesión en MapAware</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" autoFocus />

              <Form.Group className="mb-3" controlId="password"></Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <button className="forgotPswrd">Has olvidado tu contraseña?</button>
            <button className="register-button">Registrate en MapAware</button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
            Iniciar sesión
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Mapa */}
      <MapContainer center={[-34.603851, -58.381775]} zoom={13} ref={mapRef} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marcadores */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={CustomIcons}>
            <Popup>
              {marker.popUp}
            </Popup>
          </Marker>
        ))}
        {/* Marcador para la ubicación actual */}
        <LocateMarker position={position} />
        <ZoomControl className="zoomControl" position="bottomright"/>
      </MapContainer>
    </div>
  );
}

export default Map;