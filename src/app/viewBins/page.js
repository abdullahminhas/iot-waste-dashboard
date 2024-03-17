"use client";
import React, { useState, useEffect, useContext } from "react";
import { db } from "@/components/firebase"; // Import the db object
import SingleMapComponent from "@/components/singleMapComponent";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/appContext";

const WasteBinList = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [wasteBins, setWasteBins] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [currentSelection, setCurrentSelection] = useState("All");

  const fetchData = async () => {
    const binsRef = db.ref("bins"); // Reference to the "bins" collection
    const usersRef = db.ref("users"); // Reference to the "users" collection

    try {
      const binsSnapshot = await binsRef.once("value");
      const binsData = binsSnapshot.val();

      if (binsData) {
        // Convert bins data to array format
        const binsArray = Object.values(binsData).flatMap((obj) =>
          Object.values(obj)
        );

        // Check if currentSelection is "All"
        if (currentSelection === "All") {
          // Fetch all bins without filtering
          const promises = binsArray.map(async (bin) => {
            if (bin.binCollector) {
              const userSnapshot = await usersRef
                .child(bin.binCollector)
                .once("value");
              const userData = userSnapshot.val();
              return { ...bin, collectorData: userData }; // Merge bin and collector data
            } else {
              return bin; // No collector data available
            }
          });

          // Wait for all promises to resolve
          const binsWithCollectorData = await Promise.all(promises);
          setWasteBins(binsWithCollectorData);
          setInitialData(binsWithCollectorData);
        } else {
          // Filter bins with specified status
          const filteredBinsArray = binsArray.filter(
            (bin) => bin.binStatus === currentSelection
          );

          // Fetch collector data for each filtered bin
          const promises = filteredBinsArray.map(async (bin) => {
            if (bin.binCollector) {
              const userSnapshot = await usersRef
                .child(bin.binCollector)
                .once("value");
              const userData = userSnapshot.val();
              return { ...bin, collectorData: userData }; // Merge bin and collector data
            } else {
              return bin; // No collector data available
            }
          });

          // Wait for all promises to resolve
          const binsWithCollectorData = await Promise.all(promises);
          setWasteBins(binsWithCollectorData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      binsRef.off(); // Cleanup listeners on component unmount
      usersRef.off();
    }
  };

  // useEffect(() => {
  //   const ref = db.ref("bins");

  //   ref.on("value", (snapshot) => {
  //     const dataArray = Object.values(snapshot.val());
  //     const emptyBinsArray = dataArray.filter(
  //       (bin) => bin.binStatus === "empty"
  //     );
  //     const filledBinsArray = dataArray.filter(
  //       (bin) => bin.binStatus === "filled"
  //     );
  //     setEmptyWasteBins(emptyBinsArray);
  //     setFilledWasteBins(filledBinsArray);
  //     setWasteBins(dataArray);
  //   });

  //   return () => ref.off();
  // }, []);

  const onRadioChange = (event) => {
    if (event.target.id === "All") {
      router.refresh();
    } else {
      setCurrentSelection(event.target.id);
    }
  };

  // Function to handle dropdown change
  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "All") {
      router.refresh();
    } else {
      // Filter bins based on binLocation containing "Sector A"
      const filteredBins = initialData.filter((bin) =>
        bin.binLocation.toLowerCase().includes(selectedValue.toLowerCase())
      );

      console.log("Filtered Bins:", filteredBins);

      setWasteBins(filteredBins);
    }
  };

  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  useEffect(() => {
    fetchData();
  }, [currentSelection]);

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
        <nav className="navbar navbar-expand-lg bg-dark">
          <div className="container">
            <a className="navbar-brand text-light" href="/">
              View Bins
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
                    className="nav-link text-light dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Profile
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* <li>
                      <a className="dropdown-item" href="#">
                        Sttings
                      </a>
                    </li> */}
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
        <div className="container">
          <div className="d-flex flex-row justify-content-between align-items-center mt-5">
            {currentSelection === "All" ? (
              <select
                className="form-select w-25"
                onChange={handleDropdownChange}
              >
                <option value="all">All Sectors</option>
                <option value="sector a">Sector A</option>
                <option value="sector b">Sector B</option>
              </select>
            ) : (
              <div></div>
            )}
            <div className="d-flex flex-row align-items-center justify-content-end">
              <input
                type="radio"
                className="btn-check"
                name="options-base"
                id="All"
                autoComplete="off"
                onChange={onRadioChange}
                defaultChecked
              />
              <label className="btn" htmlFor="All">
                All
              </label>
              <input
                type="radio"
                className="btn-check"
                name="options-base"
                id="empty"
                autoComplete="off"
                onChange={onRadioChange}
              />
              <label className="btn" htmlFor="empty">
                Unfilled Bins
              </label>

              <input
                type="radio"
                className="btn-check"
                name="options-base"
                id="partial"
                autoComplete="off"
                onChange={onRadioChange}
              />
              <label className="btn" htmlFor="partial">
                Partial Filled Bins
              </label>

              <input
                type="radio"
                className="btn-check"
                name="options-base"
                id="filled"
                autoComplete="off"
                onChange={onRadioChange}
              />
              <label className="btn" htmlFor="filled">
                Filled Bins
              </label>
            </div>
          </div>
          <div className="row my-4 g-4">
            {wasteBins.map((streetData, index) => (
              <div className="col-md-4" key={index}>
                <div className="card mb-3">
                  {streetData.binStatus === "filled" && (
                    <div className="ribbon">Filled</div>
                  )}
                  <SingleMapComponent location={streetData} />
                  <div className="card-body">
                    <p className="card-title mb-0">
                      {streetData.binName ? streetData.binName : "N/A"}
                    </p>
                    <small className="card-text text-muted">
                      {streetData.binLocation}
                    </small>
                    <div className="progress mt-3">
                      <div
                        className={`progress-bar ${
                          streetData.binPercentage < 25
                            ? "bg-success"
                            : streetData.binPercentage < 50
                            ? "bg-primary"
                            : streetData.binPercentage < 75
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                        role="progressbar"
                        style={{ width: `${streetData.binPercentage}%` }}
                        aria-valuenow={streetData.binPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {streetData.binPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default WasteBinList;
