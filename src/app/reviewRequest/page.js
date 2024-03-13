"use client";
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import { db } from "@/components/firebase";

const reviewRequest = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const ref = db.ref("users"); // your Realtime Database reference

    ref.on("value", (snapshot) => {
      const collectorData = [];
      Object.keys(snapshot.val()).forEach((key) => {
        if (snapshot.val()[key].status === "pending") {
          collectorData.push(snapshot.val()[key]);
        }
      });

      setData(collectorData);
    });
    return () => ref.off(); // Clean up listener on component unmount
  }, []);

  const handleAccept = (userID, userObj) => {
    const newData = { ...userObj, status: "true" };

    console.log("clicked", newData);
    const ref = db.ref(`users/${userID}`); // your Realtime Database reference

    ref
      .update(newData)
      .then(() => {
        console.log("Record updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating record: ", error);
      });
  };

  const handleReject = (userID) => {
    console.log(userID);

    const ref = db.ref(`users/${userID}`); // your Realtime Database reference

    ref
      .remove()
      .then(() => {
        console.log("Record deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting record: ", error);
      });
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

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
              Review Request
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
          <div className="row my-4 g-4">
            {data &&
              Object.values(data).map((user) => (
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
                    <div className="d-flex flex-row align-items-center justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleReject(user.uId)}
                      >
                        Reject
                      </button>
                      <h6 className="mb-0 text-center">
                        {user.userType === "community_person"
                          ? " Community Person"
                          : "Waste Collector"}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => handleAccept(user.uId, user)}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {data.length === 0 ? (
              <div className="col-md-6 mx-auto">
                <div className="card card-body">
                  <small className="text-muted text-center">
                    No pending Requests
                  </small>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default reviewRequest;
