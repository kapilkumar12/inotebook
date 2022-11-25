import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../index.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  let history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/login");
  };
  let location = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        {/* eslint-disable-next-line */}
        <Link className="navbar-brand" to="/">
          iNotebook
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item ">
              <Link
                className={`nav-link navbar ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                to="/about"
              >
                About
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            <form className="form-inline my-2 my-lg-0">
              <Link to="login" className="btn btn-primary  mx-2 " role="button">
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary  mx-2 "
                role="button"
              >
                Sign Up
              </Link>
            </form>
          ) : (
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
