import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { AdminAuthContext } from "../context/adminAuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { admin, logoutAdmin } = useContext(AdminAuthContext);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">JobShare</h1>

      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* USER LOGGED IN */}
        {user && !admin && (
          <>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/")} to="/">Home</Link>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/search")} to="/search">Search</Link>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/post-job")} to="/post-job">Post Job</Link>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/profile")} to="/profile">Profile</Link>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}

        {/* ADMIN LOGGED IN */}
        {admin && (
          <>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/admin-dashboard")} to="/admin-dashboard">
              Admin Dashboard
            </Link>
            <button className="logout-btn" onClick={logoutAdmin}>Logout</button>
          </>
        )}

        {/* NO ONE LOGGED IN */}
        {!user && !admin && (
          <>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/login")} to="/login">Login</Link>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/signup")} to="/signup">Signup</Link>
            <Link onClick={() => setMenuOpen(false)} className={isActive("/admin-login")} to="/admin-login">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
