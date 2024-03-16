import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";

function MapComponent({ locations }) {
  const [geoLocation, setGeoLocation] = useState([]);
  // const locations = [
  //   { latitude: 33.572443, longitude: 73.143698 },
  //   { latitude: 33.572443, longitude: 73.145174 }, // Example location 2
  //   { latitude: 33.571729, longitude: 73.145214 }, // Example location 3
  // ];

  useEffect(() => {
    console.log(locations);
    const extractedLocations = locations.flatMap((streetData) =>
      Object.values(streetData).map((binData) => ({
        latitude: binData.binLat,
        longitude: binData.binLng,
      }))
    );

    setGeoLocation(extractedLocations);
    console.log(extractedLocations);
  }, [locations]);

  return (
    <Map
      height={400}
      defaultCenter={[33.57220086492103, 73.14640631473502]}
      defaultZoom={15}
    >
      {geoLocation.map((location, index) => (
        <Marker
          key={index}
          anchor={[location.latitude, location.longitude]} // Use square brackets for array
          width={50}
          color="red"
          onClick={() =>
            alert(
              "Marker clicked for location ",
              location.latitude,
              location.longitude
            )
          }
        />
      ))}
    </Map>
  );
}

export default MapComponent;
