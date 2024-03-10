"use client";
import React, { useState, useEffect, useContext } from "react";
import { db } from "@/components/firebase"; // Import the db object
import { AppContext } from "@/context/appContext";
import MapContainer from "@/components/mapComponent";
import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [wasteCollectors, setWasteCollectors] = useState([]);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [wasteBins, setWasteBins] = useState([]);

  useEffect(() => {
    const ref = db.ref("users"); // your Realtime Database reference

    ref.on("value", (snapshot) => {
      const collectorData = [];
      const communityMembersData = [];
      Object.keys(snapshot.val()).forEach((key) => {
        if (snapshot.val()[key].userType === "collector") {
          collectorData.push(snapshot.val()[key]);
        }
      });

      Object.keys(snapshot.val()).forEach((key) => {
        if (snapshot.val()[key].userType === "community_person") {
          communityMembersData.push(snapshot.val()[key]);
        }
      });

      setCommunityMembers(communityMembersData);
      setWasteCollectors(collectorData);
    });

    return () => ref.off(); // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    const ref = db.ref("bins"); // your Realtime Database reference

    ref.on("value", (snapshot) => {
      const dataArray = Object.values(snapshot.val());
      setWasteBins(dataArray);
    });

    return () => ref.off(); // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    if (auth === false) {
      router.push("/login");
    }
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (auth === null || auth === false) {
    return null;
  }

  // const locations = [
  //   { lat: 33.6941, lng: 73.0421 }, // Sector F-8
  //   { lat: 33.7001, lng: 73.0728 }, // Sector G-9
  //   { lat: 33.6331, lng: 73.1448 }, // Sector H-11
  //   { lat: 33.6926, lng: 73.0686 }, // Sector I-8
  //   { lat: 33.6988, lng: 73.0442 }, // Sector E-7
  // ];

  if (auth) {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <a className="navbar-brand" href="/">
              Home
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Profile
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        Sttings
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-4">
              <div className="card border-0 card-body gradient-1">
                <h6 className="text-light mb-4">Community Members</h6>
                <h4 className="text-white mb-0">
                  {communityMembers && communityMembers.length}
                </h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 card-body gradient-2">
                <h6 className="text-light mb-4">Waste Collectors</h6>
                <h4 className="text-white mb-0">{wasteCollectors.length}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 card-body gradient-3">
                <h6 className="text-light mb-4">Waste Bins</h6>
                <h4 className="text-white mb-0">{wasteBins.length}</h4>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card border-0 overflow-hidden">
                <MapContainer locations={wasteBins} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyComponent;
