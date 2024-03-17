"use client";
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import { db } from "@/components/firebase";

const addCommunityMem = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [data, setData] = useState({});

  const onFormSubmit = async (event) => {
    event.preventDefault();

    // Reference to the database
    const dbRef = db.ref();

    // Data to be inserted
    let pData = {
      userName: event.target[0].value,
      userEmail: event.target[1].value,
      userType: event.target[2].value,
      uId: event.target[3].value,
    };

    // Insert data into the database
    dbRef
      .child("users")
      .push(pData)
      .then(() => {
        console.log("Data inserted successfully");
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });

    console.log(pData);
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
              Add Person
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
              <label htmlFor="pName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="pName"
                placeholder="Jane Doe"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="pemail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="pemail"
                placeholder="example@test.com"
              />
            </div>
            {/* <div className="col-md-6">
              <label htmlFor="pLocation" className="form-label">
                Latitude
              </label>
              <input
                type="text"
                className="form-control"
                id="pLocation"
                placeholder="Lat"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="pinLocation" className="form-label">
                Longitude
              </label>
              <input
                type="text"
                className="form-control"
                id="pinLocation"
                placeholder="Long"
              />
            </div> */}
            <div className="col-md-6">
              <label htmlFor="pSelection" className="form-label">
                Role
              </label>
              <select
                className="form-select text-muted"
                aria-label="Default select example"
                id="pSelection"
              >
                <option defaultValue hidden>
                  Role
                </option>
                <option value="community_person">Community Member</option>
                <option value="collector">Waste Collector</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="pId" className="form-label">
                User Id
              </label>
              <input
                type="text"
                className="form-control"
                id="pId"
                placeholder="User Id"
              />
            </div>
            <div className="col-md-3">
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

export default addCommunityMem;
