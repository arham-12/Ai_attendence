// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Navbar component
const Navbar = ({ links, activeLink, handleLinkClick }) => {
  return (
    <nav className="bg-blue-300 text-white py-4 shadow-lg rounded-lg mt-1">
      <div className="container mx-auto flex justify-center">
        <div className="flex space-x-4">
          {links.map((link) => {
            const IconComponent = link.icon; // Extract icon from the link object
            return (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => handleLinkClick(link.key)}
                className="cursor-pointer flex items-center space-x-2"
              >
                {IconComponent && (
                  <IconComponent
                    className={`${
                      activeLink === link.key ? 'text-xl' : 'text-gray-600'
                    }`}
                  />
                )}
                <span
                  className={`${
                    activeLink === link.key ? 'font-bold' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
