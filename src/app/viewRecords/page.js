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

  const onRadioChange = (event) => {
    setCurrentSelection(event.target.id);
  };

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
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <a className="navbar-brand" href="/">
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

            <input
              type="radio"
              className="btn-check"
              name="options-base"
              id="option7"
              autoComplete="off"
              disabled
            />
            <label className="btn" htmlFor="option7">
              Bins
            </label>
          </div>
          <div className="row mt-4 g-4">
            {Object.values(data).map((user) => (
              <div className="col-md-4" key={user.uId}>
                <div className="card card-body">
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
                      <h6 className="text-capitalize">{user.userName}</h6>
                      <small className="text-muted">{user.userEmail}</small>
                    </div>
                  </div>
                  <h4 className="mb-0 mt-4 text-center">
                    {user.userType === "community_person"
                      ? " Community Person"
                      : "Waste Collector"}
                  </h4>
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
