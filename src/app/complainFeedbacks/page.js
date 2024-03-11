"use client";
import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import { db } from "@/components/firebase";

const complainFeedbacks = () => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AppContext);
  const [data, setdata] = useState([]);
  const [currentSelection, setCurrentSelection] = useState("complains");

  useEffect(() => {
    if (currentSelection === "complains") {
      const ref = db.ref("complains"); // your Realtime Database reference

      ref.on("value", (snapshot) => {
        const dataArray = Object.values(snapshot.val());
        setdata(dataArray);
      });

      return () => ref.off(); // Clean up listener on component unmount
    } else if (currentSelection === "feedbacks") {
      const ref = db.ref("feedback"); // your Realtime Database reference

      ref.on("value", (snapshot) => {
        const dataArray = Object.values(snapshot.val());
        setdata(dataArray);
      });

      return () => ref.off(); // Clean up listener on component unmount
    }
  }, [currentSelection]);

  const onRadioChange = (event) => {
    setCurrentSelection(event.target.id);
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
              Complains & Feedbacks
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
          <div className="d-flex flex-row align-items-center justify-content-end mt-5">
            <input
              type="radio"
              className="btn-check"
              name="options-base"
              id="complains"
              autoComplete="off"
              onChange={onRadioChange}
              defaultChecked
            />
            <label className="btn" htmlFor="complains">
              Complains
            </label>

            <input
              type="radio"
              className="btn-check"
              name="options-base"
              id="feedbacks"
              onChange={onRadioChange}
              autoComplete="off"
            />
            <label className="btn" htmlFor="feedbacks">
              Feedbacks
            </label>
          </div>
          <div className="row my-4 g-4">
            {data.map((message, index) => (
              <div key={index} className="col-md-4">
                <div className="card mb-4 overflow-visible h-100">
                  <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                    {index + 1}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                  <div className="card-body">
                    <h6 className="card-title">{message.email}</h6>
                    <p className="card-text text-muted">{message.message}</p>
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

export default complainFeedbacks;
