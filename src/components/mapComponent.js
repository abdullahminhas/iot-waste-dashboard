import React, { useEffect, useMemo } from "react";
import { Map, Marker } from "pigeon-maps";

function MapComponent({ locations }) {
  const centerAndZoom = useMemo(() => {
    if (locations.length === 0) {
      return {
        center: [33.57220086492103, 73.14640631473502],
        zoom: 15,
      };
    }

    // Calculate the bounding box of all locations
    const latitudes = locations.map((location) => location.latitude);
    const longitudes = locations.map((location) => location.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Calculate the center point
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate the zoom level
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const zoomLat = Math.floor(Math.log2(360 / 0.01 / latDiff));
    const zoomLng = Math.floor(Math.log2(360 / 0.01 / lngDiff));
    const zoom = Math.min(zoomLat, zoomLng, 18); // Limit the zoom level to 18

    return {
      center: [centerLat, centerLng],
      zoom,
    };
  }, [locations]);

  useEffect(() => {
    console.log(centerAndZoom);
  }, [centerAndZoom]);

  return (
    <Map
      height={400}
      defaultCenter={centerAndZoom.center}
      defaultZoom={centerAndZoom.zoom}
    >
      {locations.map((location, index) => (
        <Marker
          key={index}
          anchor={[location.latitude, location.longitude]}
          payload={{ binStatus: location.binStatus }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill={
              location.binStatus === "filled"
                ? "red"
                : location.binStatus === "empty"
                ? "green"
                : "blue"
            }
            className="bi bi-trash3-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </Marker>
      ))}
    </Map>
  );
}

export default MapComponent;
