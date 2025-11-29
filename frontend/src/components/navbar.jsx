import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { AdminAuthContext } from "../context/adminAuthContext";
import { useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { admin, logoutAdmin } = useContext(AdminAuthContext);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <nav className="navbar">
        <h1 className="logo">JP Bridge</h1>

        {/* Hamburger (visible only on mobile) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "show-menu" : ""}`}>
          {user && !admin && (
            <>
              <Link className={isActive("/")} to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link className={isActive("/search")} to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
              <Link className={isActive("/post-job")} to="/post-job" onClick={() => setMenuOpen(false)}>Post Job</Link>
              <Link className={isActive("/profile")} to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          )}

          {!user && !admin && (
            <>
              <Link className={isActive("/login")} to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className={isActive("/signup")} to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
              <Link className={isActive("/admin-login")} to="/admin-login" onClick={() => setMenuOpen(false)}>Admin Login</Link>
            </>
          )}

          {admin && (
            <>
              <Link className={isActive("/admin-dashboard")} to="/admin-dashboard" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              <button onClick={() => { logoutAdmin(); setMenuOpen(false); }}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {user && !admin && (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/">Home</Link>
              <Link onClick={() => setMenuOpen(false)} to="/search">Search</Link>
              <Link onClick={() => setMenuOpen(false)} to="/post-job">Post Job</Link>
              <Link onClick={() => setMenuOpen(false)} to="/profile">Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          )}

          {!user && !admin && (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/login">Login</Link>
              <Link onClick={() => setMenuOpen(false)} to="/signup">Signup</Link>
              <Link onClick={() => setMenuOpen(false)} to="/admin-login">Admin Login</Link>
            </>
          )}

          {admin && (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/admin-dashboard">Admin Dashboard</Link>
              <button onClick={() => { logoutAdmin(); setMenuOpen(false); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
