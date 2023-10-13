import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
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
        <li>
          {currentUser ? (
            <Link to="/profile">
              <div
                style={{
                  backgroundImage: `url(${currentUser.profilePicture})`,
                }}
                alt="user"
                className="profile-img"
              ></div>
            </Link>
          ) : (
            <Link to="/sign-in">
              <button className="btn">Sign In</button>
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
