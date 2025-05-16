import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      <h4 className="text-center"> &copy; {currentYear} |Gangadhar Pawar| All Rights Reserved </h4>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Policy</Link>
      </p>
    </div>
  );
};

export default Footer;
