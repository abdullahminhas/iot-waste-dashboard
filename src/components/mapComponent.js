import React, { useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const MapContainer = ({ locations }) => {
  const mapStyles = {
    height: `calc(100vh - 240px)`,
    minHeight: "400px",
    width: "100%",
  };

  const defaultCenter = {
    lat: 33.6844, // Latitude of Islamabad
    lng: 73.0479, // Longitude of Islamabad
  };

  useEffect(() => {
    console.log("locations", locations);
  }, [locations]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyB8Zp_xB5VjC-sgVqsPeLxOyxRnfvqCasE">
      <GoogleMap mapContainerStyle={mapStyles} zoom={11} center={defaultCenter}>
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.binLat, lng: location.binLng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
