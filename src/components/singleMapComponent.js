import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"; // Adjust for your chosen library

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const singleMapComponent = ({ location }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyB8Zp_xB5VjC-sgVqsPeLxOyxRnfvqCasE">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={{ lat: location.binLat, lng: location.binLng }}
      >
        {location && (
          <Marker
            key={1} // Add a key for the single marker
            position={{ lat: location.binLat, lng: location.binLng }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default singleMapComponent;
