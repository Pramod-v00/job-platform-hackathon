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

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <nav className="navbar">
        <h1 className="logo">JobShare</h1>

        {/* Hamburger Button — MOBILE ONLY */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Desktop Links (unchanged) */}
        <div className="nav-links desktop-only">
          {user && !admin && (
            <>
              <Link className={isActive("/")} to="/">Home</Link>
              <Link className={isActive("/search")} to="/search">Search</Link>
              <Link className={isActive("/post-job")} to="/post-job">Post Job</Link>
              <Link className={isActive("/profile")} to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}

          {admin && (
            <>
              <Link className={isActive("/admin-dashboard")} to="/admin-dashboard">
                Admin Dashboard
              </Link>
              <button onClick={logoutAdmin}>Logout</button>
            </>
          )}

          {!user && !admin && (
            <>
              <Link className={isActive("/login")} to="/login">Login</Link>
              <Link className={isActive("/signup")} to="/signup">Signup</Link>
              <Link className={isActive("/admin-login")} to="/admin-login">Admin Login</Link>
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
