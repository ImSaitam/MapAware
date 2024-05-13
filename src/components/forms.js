import { Form } from "react-bootstrap";
import LeafletgeoSearch from "./GeoSearch.js";
import { MapContainer, TileLayer, ZoomControl, useMap, Marker } from "react-leaflet";
import { useRef, useState } from "react";
import { Icon } from "leaflet";

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