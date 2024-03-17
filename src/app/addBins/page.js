"use client";
import React, { useEffect, useState, useContext } from "react";
import { db } from "@/components/firebase"; // Import the db object
import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

const addBins = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [data, setData] = useState({});
  const [currentSelection, setCurrentSelection] = useState("community_person");

  useEffect(() => {
    const ref = db.ref("users"); // your Realtime Database reference

    ref.on("value", (snapshot) => {
      const collectorData = {};
      Object.keys(snapshot.val()).forEach((key) => {
        if (snapshot.val()[key].userType === currentSelection) {
          collectorData[key] = snapshot.val()[key];
        }
      });
      setData(collectorData);
    });

    return () => ref.off(); // Clean up listener on component unmount
  }, [currentSelection]);

  const onSelectionChange = (event) => {
    event.preventDefault();

    setCurrentSelection(event.target.value);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const keyName =
      event.target[5].value === "community_person"
        ? "comCollector"
        : "binCollector";

    // Reference to the database
    const dbRef = db.ref();

    // Data to be inserted
    let binData = {
      binName: event.target[0].value,
      binLocation: event.target[1].value,
      binLat: parseFloat(event.target[2].value),
      binLng: parseFloat(event.target[3].value),
      binId: event.target[4].value,
      [keyName]: event.target[6].value,
    };

    // Insert data into the database
    dbRef
      .child("bins")
      .push(binData)
      .then(() => {
        console.log("Data inserted successfully");
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });

    console.log(binData);
  };

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
              Add Bins
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
        <div className="container mt-5">
          <form
            onSubmit={onFormSubmit}
            className="row justify-content-center g-3"
          >
            <div className="col-md-6">
              <label htmlFor="binName" className="form-label">
                Bin Name
              </label>
              <input
                type="text"
                className="form-control"
                id="binName"
                placeholder="Viking Street Bin"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="binLocation" className="form-label">
                Bin Location
              </label>
              <input
                type="text"
                className="form-control"
                id="binLocation"
                placeholder="Street #4 Bin"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="binLocation" className="form-label">
                Bin Latitude
              </label>
              <input
                type="text"
                className="form-control"
                id="binLatitude"
                placeholder="Lat"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="binLocation" className="form-label">
                Bin Longitude
              </label>
              <input
                type="text"
                className="form-control"
                id="binLatitude"
                placeholder="Long"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="binId" className="form-label">
                Bin Id
              </label>
              <input
                type="text"
                className="form-control"
                id="binId"
                placeholder="Bin Id"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="binSelection" className="form-label">
                Select Person
              </label>
              <select
                className="form-select text-muted"
                aria-label="Default select example"
                onChange={onSelectionChange}
                id="binSelection"
              >
                <option value="community_person" defaultValue>
                  Community Member
                </option>
                <option value="collector">Waste Collector</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="binAssign" className="form-label">
                Assign Bin
              </label>
              <select
                className="form-select text-muted"
                aria-label="Default select example"
                id="binAssign"
              >
                <option defaultValue hidden>
                  Assign Bin
                </option>
                {data &&
                  Object.values(data).map((user) => (
                    <option value={user.uId} key={user.uId}>
                      {user.userName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-4">
              <button className="btn btn-primary w-100" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
};

export default addBins;
