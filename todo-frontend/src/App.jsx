// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Hook to access Redux state.
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// A wrapper component to protect routes.
// It checks if the user is logged in. If not, it redirects to /login.
const ProtectedRoute = ({ children }) => {
  // Select the token from the auth slice in the Redux store.
  const token = useSelector((state) => state.auth.token);

  // If a token exists, render the child component (Dashboard).
  // If not, navigate to the login page.
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect any unknown path to the dashboard (which will redirect to login if not authenticated) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;