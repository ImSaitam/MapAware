import { useMap, Marker } from "react-leaflet";
import { useState } from "react";
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

export default GetMapCenter;