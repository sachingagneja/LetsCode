import React, { useState } from "react";
import LinkBtn from "./LinkBtn";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/authSlice";
import { useNavigate } from "react-router";

function Header({ isAdmin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = localStorage.getItem("username");
  const authStatus = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    dispatch(logout());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-blue-900 text-lime-300 flex justify-between items-center px-4 py-5 w-full">
        <h1 className="text-3xl md:text-5xl font-mono">LetsCode</h1>
        <div className="hidden md:flex flex-wrap justify-between items-center gap-8">
          {/* Navigation links */}
          <LinkBtn to="/" text="Home" className="hover:text-white" />
          <LinkBtn
            to={`/${username}/contribute`}
            text="Contribute A Question"
            className="hover:text-white transition-all"
          />
          <LinkBtn
            to={`/${username}/query`}
            text="Query"
            className="hover:text-white transition-all"
          />
          <LinkBtn
            to="/Questions"
            text="Questions"
            className="hover:text-white transition-all"
          />
          {/* Conditional rendering based on auth status */}
          {!authStatus.auth ? (
            <LinkBtn
              text="Login"
              to="/login"
              className="text-black transition-all border-2 border-black px-4 py-2 rounded-2xl bg-cyan-300 hover:bg-lime-300"
            />
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="cursor-pointer">Welcome, {username}</span>
              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 bg-blue-900 border border-gray-300 py-4 px-4 shadow-md rounded w-48"
                  role="menu"
                >
                  {isAdmin === "true" && (
                    <LinkBtn
                      text="Admin"
                      to={`${username}/admin`}
                      className="block hover:text-white"
                      onClick={handleMenuLinkClick}
                    />
                  )}
                  <LinkBtn
                    text="Profile"
                    to={`/profile/${username}`}
                    className="block hover:text-white"
                    onClick={handleMenuLinkClick}
                  />
                  <LinkBtn
                    text="Logout"
                    to="/login"
                    onClick={(e) => {
                      handleLogout(e);
                      handleMenuLinkClick();
                    }}
                    className="block hover:text-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {/* Hamburger menu button */}
        <button
          className="lg:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-lime-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </header>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 py-2 px-4">
          {/* Navigation links */}
          <LinkBtn
            to="/"
            text="Home"
            className="block text-white my-2"
            onClick={handleMenuLinkClick}
          />
          <LinkBtn
            to={`/${username}/contribute`}
            text="Contribute A Question"
            className="block text-white my-2"
            onClick={handleMenuLinkClick}
          />
          <LinkBtn
            to={`/${username}/query`}
            text="Query"
            className="block text-white my-2"
            onClick={handleMenuLinkClick}
          />
          <LinkBtn
            to="/Questions"
            text="Questions"
            className="block text-white my-2"
            onClick={handleMenuLinkClick}
          />
          {/* Conditional rendering based on auth status */}
          {!authStatus.auth ? (
            <LinkBtn
              text="Login"
              to="/login"
              className="block text-white my-2"
              onClick={handleMenuLinkClick}
            />
          ) : (
            <div>
              <span className="text-white block my-2">Welcome, {username}</span>
              {isAdmin === "true" && (
                <LinkBtn
                  text="Admin"
                  to={`${username}/admin`}
                  className="block text-white my-2"
                  onClick={handleMenuLinkClick}
                />
              )}
              <LinkBtn
                text="Profile"
                to={`/profile/${username}`}
                className="block text-white my-2"
                onClick={handleMenuLinkClick}
              />
              <LinkBtn
                text="Logout"
                to="/login"
                onClick={(e) => {
                  handleLogout(e);
                  handleMenuLinkClick();
                }}
                className="block text-white my-2"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
