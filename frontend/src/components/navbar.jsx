// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { AdminAuthContext } from "../context/adminAuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { admin, logoutAdmin } = useContext(AdminAuthContext);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="navbar">
      {/* 🔹 Change text here if you want JP Bridge */}
      <h1 className="logo">JP Bridge</h1>

      <div className="nav-links">
        {/* USER LOGGED IN */}
        {user && !admin && (
          <>
            <Link className={isActive("/")} to="/">Home</Link>
            <Link className={isActive("/search")} to="/search">Search</Link>
            <Link className={isActive("/post-job")} to="/post-job">Post Job</Link>
            <Link className={isActive("/profile")} to="/profile">Profile</Link>

            <button
              className="logout-btn"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

        {/* ADMIN LOGGED IN */}
        {admin && (
          <>
            <Link
              className={isActive("/admin-dashboard")}
              to="/admin-dashboard"
            >
              Admin Dashboard
            </Link>

            <button
              className="logout-btn"
              type="button"
              onClick={logoutAdmin}
            >
              Logout
            </button>
          </>
        )}

        {/* NO ONE LOGGED IN */}
        {!user && !admin && (
          <>
            <Link className={isActive("/login")} to="/login">Login</Link>
            <Link className={isActive("/signup")} to="/signup">Signup</Link>
            <Link className={isActive("/admin-login")} to="/admin-login">
              Admin Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
