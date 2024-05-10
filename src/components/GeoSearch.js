import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

function LeafletgeoSearch() {
    const map = useMap();
    useEffect(() => {
      const provider = new OpenStreetMapProvider();

      const searchControl = new GeoSearchControl({
        provider,
        showMarker: false,
        showPopup: false,
      });
      map.addControl(searchControl);

      return () => map.removeControl(searchControl);
    });

    return null;
  }

export default LeafletgeoSearch;