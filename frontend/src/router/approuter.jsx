import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/signup";
import Login from "../pages/login";
import Home from "../pages/home";
import PostJob from "../pages/postjob";
import Profile from "../pages/profile";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import SearchPage from "../pages/search";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
// ⭐ ADD THIS IMPORT
import ResetPassword from "../pages/resetpassword";

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* ⭐ Add Reset Password Route (NO PRIVATE ROUTE NEEDED) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/post-job"
          element={
            <PrivateRoute>
              <PostJob />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
