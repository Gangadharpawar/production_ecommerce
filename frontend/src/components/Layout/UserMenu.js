import React from "react";
import { NavLink } from "react-router-dom";
const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h2 style={{ backgroundColor: "black", color: "white", paddingBottom: "6px" }}> User Dashboard</h2>

          <div className="list-group">
            <NavLink
              to="/dashboard/user/profile"
              className="list-group-item list-group-item-action "
              aria-current="true"
            >
              Profile
            </NavLink>
            <NavLink
              to="/dashboard/user/orders"
              className="list-group-item list-group-item-action"
            >
              Orders
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;

