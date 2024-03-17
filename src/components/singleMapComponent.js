import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";

const singleMapComponent = ({ location }) => {
  // useEffect(() => {
  //   console.log(location);
  // }, [location]);

  return (
    <Map
      height={200}
      defaultCenter={[location.binLat, location.binLng]}
      defaultZoom={15}
    >
      <Marker
        width={50}
        anchor={[location.binLat, location.binLng]}
        color="Red"
        onClick={() => console.log(location.binLat, location.binLng)}
      />
    </Map>
  );
};

export default singleMapComponent;
