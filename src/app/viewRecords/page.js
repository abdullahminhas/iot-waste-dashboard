"use client";
import React, { useEffect, useState, useContext } from "react";
import { db } from "@/components/firebase"; // Import the db object
import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

const viewRecods = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [currentSelection, setCurrentSelection] = useState("All");
  const [data, setData] = useState([]);
  const [location, setLocation] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState({});

  const fetchData = () => {
    if (currentSelection === "All") {
      const ref = db.ref("users"); // your Realtime Database reference

      ref.on("value", (snapshot) => {
        setData(snapshot.val());
      });

      return () => ref.off(); // Clean up listener on component unmount
    } else {
      const ref = db.ref("users"); // your Realtime Database reference

      ref.on("value", (snapshot) => {
        const collectorData = [];
        Object.keys(snapshot.val()).forEach((key) => {
          if (snapshot.val()[key].userType === currentSelection) {
            collectorData.push(snapshot.val()[key]);
          }
        });

        setData(collectorData);
      });
      return () => ref.off(); // Clean up listener on component unmount
    }
  };

  useEffect(() => {
    const ref = db.ref("locations"); // your Realtime Database reference

    ref.on("value", (snapshot) => {
      console.log(snapshot.val());
      setLocation(snapshot.val());
    });

    return () => ref.off(); // Clean up listener on component unmount
  }, []);

  const onRadioChange = (event) => {
    setCurrentSelection(event.target.id);
  };

  const handleAreaChange = (event, userId) => {
    setSelectedAreas((prevState) => ({
      ...prevState,
      [userId]: event.target.value,
    }));
  };

  const handleSectorChange = (event, user) => {
    const selectedOption = JSON.parse(event.target.value);
    const selectedSector = selectedOption.sector;
    const selectedData = selectedOption.data;
    // Now you have both the selected sector name and its corresponding data object
    console.log(selectedSector);
    console.log(selectedData);
    const newData = {
      ...user,
      area: selectedSector,
      userlat: selectedData.lat,
      userLng: selectedData.lng,
    };

    console.log(newData);

    const ref = db.ref(`users/${user.uId}`); // your Realtime Database reference

    ref
      .update(newData)
      .then(() => {
        console.log("Record updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating record: ", error);
      });
  };

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // const sectors = selectedArea ? Object.keys(location[selectedArea]) : [];

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

  if (auth) {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg bg-dark">
          <div className="container">
            <a className="navbar-brand text-light" href="/">
              View Records
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
          <div className="d-flex flex-row align-items-center justify-content-end mt-5">
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
              id="community_person"
              autoComplete="off"
              onChange={onRadioChange}
            />
            <label className="btn" htmlFor="community_person">
              Community Members
            </label>

            <input
              type="radio"
              className="btn-check"
              name="options-base"
              id="collector"
              autoComplete="off"
              onChange={onRadioChange}
            />
            <label className="btn" htmlFor="collector">
              Waste Collectors
            </label>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <div className="form-check form-switch row-reverse">
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Edit to Assign Area
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isChecked}
                onChange={handleSwitchChange}
              />
            </div>
          </div>
          <div className="row my-4 g-4">
            {Object.values(data).map((user) => (
              <div className="col-md-4" key={user.uId}>
                <div className="card card-body h-100">
                  <div className="d-flex flex-row align-items-center">
                    <div
                      style={{
                        display: "block",
                        width: "55px",
                        height: "55px",
                        background: "lightgrey",
                        borderRadius: "50px",
                      }}
                    ></div>
                    <div className="d-flex flex-column ms-3">
                      <h6 className="text-capitalize">
                        {user.userName ? user.userName : "N/A"}
                      </h6>
                      <small className="text-muted">{user.userEmail}</small>
                    </div>
                  </div>
                  <h4 className="mb-0 mt-4 text-center">
                    {user.userType === "community_person"
                      ? " Community Person"
                      : "Waste Collector"}
                  </h4>
                  {isChecked && (
                    <React.Fragment>
                      {user.userType === "collector" && (
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <select
                              className="form-select"
                              onChange={(e) => handleSectorChange(e, user)}
                            >
                              <option value="" disabled>
                                Select Sector
                              </option>
                              {Object.keys(location).map((area) =>
                                Object.keys(location[area]).map(
                                  (sector, index) => (
                                    <option
                                      value={JSON.stringify({
                                        sector: sector,
                                        data: location[area][sector],
                                      })}
                                      key={index}
                                    >
                                      {sector}
                                    </option>
                                  )
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default viewRecods;
