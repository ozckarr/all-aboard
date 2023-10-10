import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">AuthTest</Link>
      </div>
      <ul>
        <Link to="/">
          <li>
            <button className="btn">Home</button>
          </li>
        </Link>
        <Link to="/about">
          <li>
            <button className="btn">About</button>
          </li>
        </Link>
        <Link to="/sign-in">
          <li>
            <button className="btn">Sign In</button>
          </li>
        </Link>
      </ul>
    </header>
  );
};

export default Header;
