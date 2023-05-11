import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavbarStyle.css";

export const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-list-container">
        <Link to="/">
          <h2>MEAL-SHARING</h2>
        </Link>
        <ul className="nav-links">
          <li>
            <NavLink to="/">HOME</NavLink>
          </li>
          <li>
            <NavLink to="/form">ADD MEAL</NavLink>
          </li>
          <li>
            <NavLink to="/about">ABOUT</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
