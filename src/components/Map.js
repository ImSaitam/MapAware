import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { Icon } from 'leaflet';
import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../Map.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { ModalBody, ModalFooter } from "react-bootstrap";

// Función del Mapa
function Map() {
  // Estado para la ubicación actual
  const [position, setPosition] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para controlar la visibilidad del modal de registro
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  // Estado para controlar la visibilidad del modal de subida de incidente
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const mapRef = useRef();

  function GetMapCenter() {
    const map = useMap();
    const [center, setCenter] = useState(null);
    const newCenter = map.getCenter();

    const centerMapIcon = new Icon({
      iconUrl: "https://static-00.iconduck.com/assets.00/map-marker-icon-342x512-gd1hf1rz.png",
      iconSize: [19, 28]
    })

    const updateCenter = () => {
      setCenter(newCenter);
      console.log("Centro:", center)
    }
    map.on('move', updateCenter);
    
    return (
      center && (
      <Marker position={[center.lat, center.lng]} icon={centerMapIcon}/>
      )
    );
  }

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
    },
    {
      geocode: [-34.510753457690186, -58.554239919318626],
      popUp: "Mesquita Mönchengladbach"
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

      <button className="button-add" onClick={() => setShowIncidentModal(true)}>
        <img src="https://pixsector.com/cache/c5433603/av741f3e5fd1c88304cf8.png" className="add-icon">
        </img>
      </button>

      {/* Modal */}
      <Modal show={showIncidentModal} onHide={() => setShowIncidentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir un incidente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Añade un titulo al incidente:</Form.Label>
              <Form.Control type="text" controlId="titleIncident" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>¿Que clase de incidente ocurrio en esa ubicación?</Form.Label>
              <select className="form-select form-select-sm">
                {/* Agregar mas tipos de incidentes!!! */}
                <option disabled selected>Tipo de incidente...</option>
                <option value={1}>Robo</option>
                <option value={2}>Choque</option>
              </select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Añade una breve descripción del incidente.</Form.Label>
              <textarea className="form-control" controlId="descriptionIncident" rows={3}></textarea>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingrese la ubicación del incidente:</Form.Label>
              <MapContainer id="mapIncident" center={[-34.603851, -58.381775]} zoom={16} ref={mapRef} zoomControl={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GetMapCenter />
                <ZoomControl className="zoomControl" position="bottomright"/>
              </MapContainer>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sube una imagen del incidente (opcional)</Form.Label>
              <Form.Control type="file" controlId="imageIncident" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <ModalFooter>
          <Button variant="primary">
            Subir incidente
          </Button>
        </ModalFooter>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inicia sesión en MapAware</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" controlId="email" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <a className="forgotPswrd">Has olvidado tu contraseña?</a>
            <a className="register-button" onClick={() => {setShowModal(false); setShowRegisterModal(true);}}>Registrate en MapAware</a>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
            Iniciar sesión
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrate en MapAware</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" controlId="nombre" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control className="mb-3" controlId="apellido" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control className="mb-3" type="date" controlId="fechaNac" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" controlId="email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" controlId="password" />
            </Form.Group>
          </Form>
        </ModalBody>
        <Modal.Footer>
          <Button variant="secondary" id="backButton" onClick={() => {setShowModal(true); setShowRegisterModal(false);}}>
            Volver
          </Button>
          <Button variant="primary">
            Registrarse
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