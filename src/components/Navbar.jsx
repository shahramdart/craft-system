import { NavLink } from "react-router-dom";
import house from "../assets/images/logo.png";
import { useSelector } from "react-redux";
import { useState } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-[#222222] shadow-md z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-5">
            {/* Left Section: User and Logo */}
            <div className="flex items-center ml-auto">
              <h5 className="text-white pt-6 text-2xl font-semibold mr-1">
                {user && user.name}
              </h5>
              <NavLink to={"/dashboard"}>
                <img
                  src={house}
                  className="pt-6"
                  width="28"
                  height="28"
                  alt="house"
                />
              </NavLink>
            </div>

            {/* Hamburger Menu Button for Small Screens */}
            <div className="sm:hidden">
              <button
                className="text-white focus:outline-none"
                onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu for Small Screens */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:justify-end space-x-4 mt-4 sm:mt-0 sm:space-x-6`}
        >
          <NavLink
            to={"/dashboard"}
            className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)} // Close menu when link is clicked
          >
            Dashboard
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
