// Librerias
import { MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import { Icon } from 'leaflet'

// Función del Mapa
function Map() {
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
  ]

  // Icono para los marcadores
  const CustomIcons = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [19, 19]
  })
  return (
    // Etiqueta del mapa
    <MapContainer center={[ -34.603851, -58.381775 ]} zoom={12}>
      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> 
    {markers.map((markers) => (
      // Marcador en el mapa con popup
      <Marker position={markers.geocode} icon={CustomIcons}>
        <Popup><h2>{markers.popUp}</h2></Popup>
      </Marker>
    ))}
    </MapContainer>

  );
}

export default Map;
